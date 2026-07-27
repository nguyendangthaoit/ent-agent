/* ============================================================
   ENTERPRISE AI AGENT — DATABASE SCHEMA (SQL Server / Azure SQL)
   Primary keys: GUID (UNIQUEIDENTIFIER), no auto-increment integers
   ============================================================ */

/* ------------------------------------------------------------
   CREATE DATABASE

   -- LOCAL SQL SERVER (SSMS / Azure Data Studio connected to an instance):
   -- Uncomment the 3 lines below and run this block FIRST, separately
   -- (SQL Server requires CREATE DATABASE and USE to run in their own
   -- batch, not in the same batch as the CREATE TABLE statements below).

   IF DB_ID('EntAgent') IS NULL
       CREATE DATABASE EntAgent;
   GO
   USE EntAgent;
   GO

   -- AZURE SQL DATABASE:
   -- Do NOT run the block above. Azure SQL does not support
   -- CREATE DATABASE / USE via T-SQL while connected to a specific
   -- database. Create the database first using one of the options
   -- below, then connect your connection string directly to that
   -- database and run the CREATE TABLE section further down
   -- (skip the CREATE DATABASE/USE block above):
   --   • Azure Portal: SQL Database > Create
   --   • Azure CLI:    az sql db create --name EntAgent --server <server> ...
   --   • T-SQL (run once from the "master" context during server setup):
   --         CREATE DATABASE EntAgent;
------------------------------------------------------------ */

-- Drop existing tables if present (so the script is re-runnable),
-- dropped in reverse order of foreign key dependencies
IF OBJECT_ID('audit_logs', 'U') IS NOT NULL DROP TABLE audit_logs;
IF OBJECT_ID('approval_requests', 'U') IS NOT NULL DROP TABLE approval_requests;
IF OBJECT_ID('access_grants', 'U') IS NOT NULL DROP TABLE access_grants;
IF OBJECT_ID('chunks', 'U') IS NOT NULL DROP TABLE chunks;
IF OBJECT_ID('documents', 'U') IS NOT NULL DROP TABLE documents;
IF OBJECT_ID('data_sources', 'U') IS NOT NULL DROP TABLE data_sources;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
IF OBJECT_ID('departments', 'U') IS NOT NULL DROP TABLE departments;
IF OBJECT_ID('organizations', 'U') IS NOT NULL DROP TABLE organizations;
GO

-- ============================================================
-- 1. ORGANIZATIONS — tenant / customer company
-- ============================================================
CREATE TABLE organizations (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    name            NVARCHAR(255)    NOT NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- ============================================================
-- 2. DEPARTMENTS — departments within an organization
-- ============================================================
CREATE TABLE departments (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    name            NVARCHAR(255)    NOT NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_departments_org FOREIGN KEY (org_id) REFERENCES organizations(id)
);
GO

-- ============================================================
-- 3. USERS
-- department_id can be NULL (org_admin is not tied to one department)
-- ============================================================
CREATE TABLE users (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    department_id   UNIQUEIDENTIFIER NULL,
    email           NVARCHAR(255)    NOT NULL UNIQUE,
    password_hash   NVARCHAR(255)    NOT NULL,
    role            NVARCHAR(50)     NOT NULL,  -- 'org_admin' | 'dep_admin' | 'member'
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_users_org  FOREIGN KEY (org_id)        REFERENCES organizations(id),
    CONSTRAINT FK_users_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);
GO

-- ============================================================
-- 4. DATA_SOURCES — data sources configured per department
-- ============================================================
CREATE TABLE data_sources (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    department_id   UNIQUEIDENTIFIER NOT NULL,
    source_type     NVARCHAR(50)     NOT NULL,   -- 'upload' | 'folder_sync'
    path_or_config  NVARCHAR(1000)   NOT NULL,
    sync_schedule   NVARCHAR(100)    NULL,        -- cron string, e.g. '0 2 * * *'
    last_synced_at  DATETIME2        NULL,
    sync_status     NVARCHAR(50)     NOT NULL DEFAULT 'idle',  -- 'idle'|'syncing'|'error'
    created_by      UNIQUEIDENTIFIER NOT NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ds_org     FOREIGN KEY (org_id)        REFERENCES organizations(id),
    CONSTRAINT FK_ds_dept    FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT FK_ds_creator FOREIGN KEY (created_by)    REFERENCES users(id)
);
GO

-- ============================================================
-- 5. DOCUMENTS — files that have been ingested
-- ============================================================
CREATE TABLE documents (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    data_source_id  UNIQUEIDENTIFIER NOT NULL,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    department_id   UNIQUEIDENTIFIER NOT NULL,
    filename        NVARCHAR(500)    NOT NULL,
    storage_path    NVARCHAR(1000)   NOT NULL,
    status          NVARCHAR(50)     NOT NULL DEFAULT 'pending', -- pending|processing|ready|failed
    uploaded_by     UNIQUEIDENTIFIER NOT NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_doc_source   FOREIGN KEY (data_source_id) REFERENCES data_sources(id),
    CONSTRAINT FK_doc_org      FOREIGN KEY (org_id)         REFERENCES organizations(id),
    CONSTRAINT FK_doc_dept     FOREIGN KEY (department_id)  REFERENCES departments(id),
    CONSTRAINT FK_doc_uploader FOREIGN KEY (uploaded_by)    REFERENCES users(id)
);
GO

-- ============================================================
-- 6. CHUNKS — mapping between a document (SQL) and its vectors (Qdrant)
-- ============================================================
CREATE TABLE chunks (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    document_id     UNIQUEIDENTIFIER NOT NULL,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    department_id   UNIQUEIDENTIFIER NOT NULL,
    chunk_index     INT              NOT NULL,
    content_preview NVARCHAR(500)    NULL,
    vector_id       NVARCHAR(100)    NOT NULL,   -- corresponding point id in Qdrant
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_chunk_doc  FOREIGN KEY (document_id)   REFERENCES documents(id),
    CONSTRAINT FK_chunk_org  FOREIGN KEY (org_id)        REFERENCES organizations(id),
    CONSTRAINT FK_chunk_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);
GO

-- ============================================================
-- 7. ACCESS_GRANTS — optional cross-department sharing
-- ============================================================
CREATE TABLE access_grants (
    id                       UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id                   UNIQUEIDENTIFIER NOT NULL,
    data_source_id           UNIQUEIDENTIFIER NOT NULL,
    granted_to_department_id UNIQUEIDENTIFIER NOT NULL,
    granted_by               UNIQUEIDENTIFIER NOT NULL,
    created_at               DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_grant_org    FOREIGN KEY (org_id)                   REFERENCES organizations(id),
    CONSTRAINT FK_grant_source FOREIGN KEY (data_source_id)           REFERENCES data_sources(id),
    CONSTRAINT FK_grant_dept   FOREIGN KEY (granted_to_department_id) REFERENCES departments(id),
    CONSTRAINT FK_grant_by     FOREIGN KEY (granted_by)               REFERENCES users(id)
);
GO

-- ============================================================
-- 8. APPROVAL_REQUESTS — human-in-the-loop approval queue
-- ============================================================
CREATE TABLE approval_requests (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    requested_by    UNIQUEIDENTIFIER NOT NULL,
    action_type     NVARCHAR(50)     NOT NULL,   -- 'send_email' | 'update_db'
    payload_json    NVARCHAR(MAX)    NOT NULL,
    status          NVARCHAR(50)     NOT NULL DEFAULT 'pending', -- pending|approved|rejected|executed
    reviewed_by     UNIQUEIDENTIFIER NULL,
    reviewed_at     DATETIME2        NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_appr_org    FOREIGN KEY (org_id)       REFERENCES organizations(id),
    CONSTRAINT FK_appr_req_by FOREIGN KEY (requested_by) REFERENCES users(id),
    CONSTRAINT FK_appr_rev_by FOREIGN KEY (reviewed_by)  REFERENCES users(id)
);
GO

-- ============================================================
-- 9. AUDIT_LOGS — trace every action taken in the system
-- ============================================================
CREATE TABLE audit_logs (
    id              UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
    org_id          UNIQUEIDENTIFIER NOT NULL,
    user_id         UNIQUEIDENTIFIER NOT NULL,
    action          NVARCHAR(100)    NOT NULL,  -- 'chat_query'|'send_email'|'update_db'|'ingest_file'
    resource        NVARCHAR(255)    NULL,
    status          NVARCHAR(50)     NOT NULL,  -- 'success'|'failed'|'denied'
    detail_json     NVARCHAR(MAX)    NULL,
    created_at      DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_audit_org  FOREIGN KEY (org_id)  REFERENCES organizations(id),
    CONSTRAINT FK_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- ============================================================
-- INDEXES — speed up the most frequent queries
-- ============================================================
CREATE INDEX idx_users_org_dept      ON users(org_id, department_id);
CREATE INDEX idx_documents_org_dept  ON documents(org_id, department_id);
CREATE INDEX idx_chunks_document     ON chunks(document_id);
CREATE INDEX idx_chunks_org_dept     ON chunks(org_id, department_id);
CREATE INDEX idx_approval_org_status ON approval_requests(org_id, status);
CREATE INDEX idx_audit_org_created   ON audit_logs(org_id, created_at);
GO


/* ============================================================
   SEED DATA — sample records for quick testing
   Uses DECLARE variables to hold generated GUIDs, since calling
   NEWID() separately in each statement would produce different
   values and break the foreign key relationships.
   ============================================================ */

DECLARE @org1        UNIQUEIDENTIFIER = NEWID();
DECLARE @deptFinance UNIQUEIDENTIFIER = NEWID();
DECLARE @deptMkt     UNIQUEIDENTIFIER = NEWID();

DECLARE @userOrgAdmin     UNIQUEIDENTIFIER = NEWID();
DECLARE @userFinanceAdmin UNIQUEIDENTIFIER = NEWID();
DECLARE @userFinanceMember UNIQUEIDENTIFIER = NEWID();

DECLARE @dataSourceFinance UNIQUEIDENTIFIER = NEWID();
DECLARE @document1         UNIQUEIDENTIFIER = NEWID();

-- 1. Organization
INSERT INTO organizations (id, name)
VALUES (@org1, N'ABC Corporation');

-- 2. Departments
INSERT INTO departments (id, org_id, name) VALUES
    (@deptFinance, @org1, N'Finance'),
    (@deptMkt,     @org1, N'Marketing');

-- 3. Users
-- Note: password_hash values here are placeholders only.
-- In real code, always hash passwords with bcrypt/argon2.
-- super_admin will be biggest role
INSERT INTO users (id, org_id, department_id, email, password_hash, role) VALUES
    (@userOrgAdmin,      @org1, NULL,         N'admin@abc.com',        N'$2b$hash_placeholder_1', N'org_admin'),
    (@userFinanceAdmin,  @org1, @deptFinance, N'finance.lead@abc.com', N'$2b$hash_placeholder_2', N'dep_admin'),
    (@userFinanceMember, @org1, @deptFinance, N'employee@abc.com',     N'$2b$hash_placeholder_3', N'member');    

-- 4. Data source (Finance department configures its own folder)
INSERT INTO data_sources (id, org_id, department_id, source_type, path_or_config, sync_schedule, created_by)
VALUES (@dataSourceFinance, @org1, @deptFinance, N'folder_sync', N'/data/finance', N'0 2 * * *', @userFinanceAdmin);

-- 5. Document (a file ingested from the source above)
INSERT INTO documents (id, data_source_id, org_id, department_id, filename, storage_path, status, uploaded_by)
VALUES (@document1, @dataSourceFinance, @org1, @deptFinance,
        N'leave-policy.pdf', N's3://bucket/finance/leave-policy.pdf',
        N'ready', @userFinanceAdmin);

-- 6. Chunks (this file was split into 2 chunks)
INSERT INTO chunks (document_id, org_id, department_id, chunk_index, content_preview, vector_id) VALUES
    (@document1, @org1, @deptFinance, 0, N'Employees are entitled to 12 days of leave per year...', N'vec-0001'),
    (@document1, @org1, @deptFinance, 1, N'Leave days are counted from the contract signing date...', N'vec-0002');

-- 7. Sample approval request (agent wants to send an email, pending review)
INSERT INTO approval_requests (org_id, requested_by, action_type, payload_json, status)
VALUES (@org1, @userFinanceMember, N'send_email',
        N'{"to":"finance.lead@abc.com","subject":"Leave request confirmation","body":"..."}',
        N'pending');

-- 8. Sample audit log
INSERT INTO audit_logs (org_id, user_id, action, resource, status, detail_json)
VALUES (@org1, @userFinanceMember, N'chat_query', CAST(@document1 AS NVARCHAR(50)), N'success',
        N'{"question":"what is the leave policy?"}');

GO

-- ============================================================
-- QUICK CHECK — run to inspect the seeded data
-- ============================================================
SELECT * FROM organizations;
SELECT * FROM departments;
SELECT * FROM users;
SELECT * FROM data_sources;
SELECT * FROM documents;
SELECT * FROM chunks;
SELECT * FROM approval_requests;
SELECT * FROM audit_logs;



--- relationship.
-- data_sources (1 folder/configuration)
--     └─→ documents (multiple files in that folder)
--             └─→ chunks (multiple small chunks of each file, mapped to Qdrant)

-- access_grants → extend read access to data_sources for other departments

-- approval_requests → queue for reviewing write/send actions (before execution)

-- audit_logs → log all actions (after they have occurred, including read and write)