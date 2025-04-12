import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain_openai import OpenAI
from langchain.tools import tool
import pandas as pd
import db_manager

# This file will contain the logic of the app, using agents and tasks
# Load the .env file to get the API KEY if available.
# If you have created the .env file, add the next line:
# load_dotenv()
# Get the OPENAI_API_KEY from the .env
# If you have created the .env file, add the next line:
# openai_api_key = os.getenv("OPENAI_API_KEY")
# if you have the API KEY add it here
# else leave empty:
# llm = OpenAI(api_key=openai_api_key)
# else:
llm = OpenAI()

@tool
def txt_reader(file_path: str) -> str:
    """Reads a text file and returns its content."""
    try:
        with open(file_path, 'r') as f:
            text = f.read()
        return text
    except Exception as e:
        return f"Error reading text file: {e}"

@tool
def excel_reader(file_path: str) -> str:
    """Reads an Excel file and returns its content."""
    try:
        df = pd.read_excel(file_path)
        return df.to_string()
    except Exception as e:
        return f"Error reading Excel: {e}"

@tool
def text_comparer(text1: str, text2: str) -> str:
    """Compares two texts and returns a summary of their differences."""
    # In a real scenario, this would use a more sophisticated comparison method.
    # For this example, we'll just return a simple message.
    return "Comparison: Text1 and Text2 have been compared. Further analysis needed."

@tool
def plan_creator(plan_text: str) -> str:
    """Creates a training plan."""
    return f"Training Plan:\n{plan_text}"

@tool
def text_filter(text: str, filter_text: str) -> str:
    """Filters a text based on a given filter."""
    # In a real scenario, this would use a more sophisticated filtering method.
    # For this example, we'll just return a simple message.
    return f"Filtered text from: '{text}' using filter: '{filter_text}'. Further filtering needed."


# Define agents
training_plan_analyst = Agent(
    role='Training Plan Analyst',
    goal='Analyze employee feedback and job description PDFs to identify skill gaps and training needs',
    backstory="""You are a seasoned HR professional with expertise in identifying training needs. 
                You meticulously analyze employee feedback and job descriptions to pinpoint areas 
                where employees need upskilling to succeed in new roles.""",
    verbose=True,
    llm = llm,
    tools=[txt_reader, text_comparer]
)

training_plan_creator = Agent(
    role='Training Plan Creator',
    goal='Create a comprehensive and personalized training plan for employees transitioning to new roles',
    backstory="""You are an experienced learning and development specialist. 
                You design effective training programs tailored to individual employee needs, 
                ensuring they have the knowledge and skills for their new positions.""",
    verbose=True,
    llm = llm,
    tools=[plan_creator],
)

content_manager = Agent(
    role='Content Manager',
    goal='Manage and filter relevant content from various sources to support the training plan',
    backstory="""You are a skilled content curator with a knack for finding the right information.
                You efficiently manage study materials and filter content to provide targeted 
                resources for employee training.""",
    verbose=True,
    llm = llm,
    tools=[excel_reader, txt_reader, text_filter]
)

# Define tasks
# Task 1: Analyze Employee Feedback
analyze_feedback_task = Task(
    description=(
        "Analyze the employee feedback from the PDF provided at '{feedback_pdf_path}'. "
        "Summarize the key feedback points and identify the employee's strengths and areas for improvement."
    ),
    expected_output="A concise summary of the employee feedback, highlighting key strengths and areas for improvement.",
    agent=training_plan_analyst,
)

# Task 2: Analyze Job Description
analyze_job_description_task = Task(
    description=(
        "Analyze the job description from the PDF provided at '{job_description_pdf_path}'. "
        "Summarize the key requirements, skills, and responsibilities for the new role."
    ),
    expected_output="A concise summary of the job description, outlining key requirements, skills, and responsibilities.",
    agent=training_plan_analyst,
)

# Task 3: Compare Documents
compare_documents_task = Task(
    description=(
        "Compare the summaries of employee feedback and job description to identify areas where the employee's "
        "skills and experience align with the new role requirements, and areas where training or development is needed."
    ),
    expected_output="A detailed comparison document outlining areas of alignment and areas needing training, with specific skill gaps identified.",
    agent=training_plan_analyst,
)

# Task 4: Create Training Plan
create_training_plan_task = Task(
    description=(
        "Based on the comparison document, create a comprehensive and personalized training plan "
        "for the employee. The plan should include specific learning objectives, recommended training "
        "activities, and resources to address the identified skill gaps. Consider integrating information"
        "from the excel file in the path '{excel_path}'"
    ),
    expected_output="A detailed training plan with learning objectives, activities, resources, and a timeline.",
    agent=training_plan_creator,
)

# Task 5: Search excel data
search_excel_data_task = Task(
    description=(
        "Using the training plan and the excel file in the path '{excel_path}', filter the excel data to find "
        "the relevant information to the training plan."
    ),
    expected_output="A filtered content of the excel with the relevant information for the training plan.",
    agent=content_manager,
)

# Task 6: Search pdfs data
search_pdfs_data_task = Task(
    description=(
        "Using the training plan and the study materials in the path '{study_material_pdf_path}', filter the pdf data to find "
        "the relevant information to the training plan."
    ),
    expected_output="A filtered content of the pdf with the relevant information for the training plan.",
    agent=content_manager,
)

# Create a Crew with agents and tasks
crew = Crew(
    agents=[training_plan_analyst, training_plan_creator, content_manager],
    tasks=[
        analyze_feedback_task,
        analyze_job_description_task,
        compare_documents_task,
        search_excel_data_task,
        search_pdfs_data_task,
        create_training_plan_task,
    ],
    process=Process.sequential,  # Tasks will be executed one after the other
    verbose=2,  # Show detailed outputs of tasks
)

def run(feedback_pdf_path, job_description_pdf_path, excel_path, study_material_pdf_path, user_id):
    """Runs the crew to generate a training plan and stores the result in the database.

    Args:
        feedback_pdf_path (str): Path to the employee feedback text file.
        job_description_pdf_path (str): Path to the job description text file.
        excel_path (str): Path to the Excel file with training resources.
        study_material_pdf_path (str): Path to the text file with study materials.
        user_id (int): The ID of the user running the crew.

    Returns:
        str: The final result of the crew execution (e.g., the training plan).
    """



    # Provide inputs for the tasks
    inputs = {
        'feedback_pdf_path': feedback_pdf_path,
        'job_description_pdf_path': job_description_pdf_path,
        'excel_path': excel_path,
        'study_material_pdf_path': study_material_pdf_path,
    }

    # Start the crew with the specified inputs
    result = crew.kickoff(inputs=inputs)

    # Store the crew result in the database
    db_manager.add_crew_result(user_id, result)

    return result
