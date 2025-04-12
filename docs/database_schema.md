# Database Schema

This document outlines the database schema for the AI-Powered Role Transition Assistant project. The database will be implemented using SQLite.

## Tables

### `users`

This table stores user information for both supervisors and employees.

| Column         | Type     | Constraints                  | Description                                         |
| -------------- | -------- | ---------------------------- | --------------------------------------------------- |
| `user_id`      | INTEGER  | PRIMARY KEY                  | Unique identifier for each user.                    |
| `username`     | TEXT     | UNIQUE, NOT NULL            | User's login username.                              |
| `password_hash`| TEXT     | NOT NULL                     | Hashed password for security.                       |
| `role`         | TEXT     | NOT NULL                     | User's role: 'supervisor' or 'employee'.             |

### `training_plans`

This table stores the generated training plans.

| Column        | Type     | Constraints                  | Description                                   |
| ------------- | -------- | ---------------------------- | --------------------------------------------- |
| `plan_id`     | INTEGER  | PRIMARY KEY                  | Unique identifier for each training plan.   |
| `user_id`     | INTEGER  | FOREIGN KEY referencing `users` | The user this plan is for. |
| `plan_content`| TEXT     | NOT NULL                     | The content of the training plan.             |

### `employee_feedback`

This table stores the feedback provided by employees.

| Column           | Type     | Constraints                  | Description                                    |
| ---------------- | -------- | ---------------------------- | ---------------------------------------------- |
| `feedback_id`    | INTEGER  | PRIMARY KEY                  | Unique identifier for each feedback entry.    |
| `user_id`        | INTEGER  | FOREIGN KEY referencing `users` | The user who provided the feedback.           |
| `feedback_content` | TEXT     | NOT NULL                     | The content of the employee's feedback.       |

### `job_descriptions`

This table stores job descriptions.

| Column           | Type     | Constraints                  | Description                                      |
| ---------------- | -------- | ---------------------------- | ------------------------------------------------ |
| `description_id` | INTEGER  | PRIMARY KEY                  | Unique identifier for each job description.     |
| `user_id`        | INTEGER  | FOREIGN KEY referencing `users` | The user who this job description is related to. |
| `description_content` | TEXT     | NOT NULL                     | The content of the job description.            |

### `study_material`
This table stores the study materials.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `material_id` | INTEGER | PRIMARY KEY | Unique identifier for each study material |
| `material_content` | TEXT | NOT NULL | The content of the material |

### `chatbot_interactions`

This table stores the conversation history between users and the chatbot.

| Column         | Type     | Constraints                  | Description                                     |
| -------------- | -------- | ---------------------------- | ----------------------------------------------- |
| `interaction_id` | INTEGER  | PRIMARY KEY                  | Unique identifier for each interaction.          |
| `user_id`      | INTEGER  | FOREIGN KEY referencing `users` | The user involved in the interaction.         |
| `message`      | TEXT     | NOT NULL                     | The content of the message.                     |
| `timestamp`    | DATETIME | NOT NULL                     | The timestamp of the message.                   |
| `type`        | TEXT | NOT NULL | The type of message: 'question' or 'answer' |