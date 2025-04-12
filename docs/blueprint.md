# **App Name**: RoleWise

## Core Features:

- User Authentication: Secure user authentication and role management for supervisors and employees.
- Training Plan Generation: Compare employee feedback and new job descriptions using AI to generate a personalized training plan. The AI model will use its tool to incorporate necessary pieces of information.
- Supervisor Chatbot Interface: Interactive chatbot interface for supervisors to review and edit training plans.
- Employee Chatbot Interface: Chatbot interface for employees to guide them through their personalized training plan.
- Data Storage: Store all inputs, outputs, and training progress securely in a database (e.g., SQLite).
- Training Plan Assignment: Assign the training plan to the particular employee

## Style Guidelines:

- Primary color: White or light grey for a clean and professional look.
- Secondary color: A muted blue or green to convey trust and stability.
- Accent: Teal (#008080) for interactive elements and progress indicators.
- Clean and intuitive layout with clear separation of content areas.
- Use clear and professional icons to represent different training modules and resources.
- Subtle animations to indicate progress and guide users through the training plan.

## Original User Request:
AI-Powered Role Transition Assistant – Project Overview
We’re building a Python-based system that supports employee transitions into new roles using CrewAI agents and a chatbot interface.


Supervisor Side:
Supervisor uploads two PDFs:

Employee Feedback

New Job Description

AI compares the two documents and generates a custom training plan.

Supervisor interacts via a chatbot interface to review and edit the plan.

All inputs and outputs are stored securely in a SQLite database.


Employee Side:
Employee receives a chatbot message:
“You’ve been selected for a new role. Here’s your training plan.”

The bot guides them through the plan, step-by-step.

Training content is pulled from:

Study material PDFs

Excel file with topics, subtopics, and resource URLs

Web access is allowed only for study materials, not for resources listed in Excel.


Key Benefits:
Personalized upskilling, faster onboarding

Easy-to-use chat interface for both roles

Fully local and secure with SQLite backend

and we are going to use angular front end and backend python flask if you have doubt ask me and we have to have a login for this two type of user
  