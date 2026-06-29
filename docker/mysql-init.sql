-- One isolated schema per service (no cross-service FKs; references are logical).
CREATE DATABASE IF NOT EXISTS db_auth         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_hrm          CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_purchasing   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_notification CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
