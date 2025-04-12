import crew_manager
import db_manager

def main(feedback_pdf_path, job_description_pdf_path, excel_path, study_material_pdf_path, user_id):
    """
        Main function to execute the crew and generate a training plan.
    """
    result = crew_manager.run(feedback_pdf_path, job_description_pdf_path, excel_path, study_material_pdf_path, user_id)
    print("Crew Execution Result:")
    print(result)

if __name__ == "__main__":
    # Hardcoded paths for the files
    feedback_pdf_path = "docs/employee_feedback.txt"
    job_description_pdf_path = "docs/job_description.txt"
    excel_path = "docs/study_material.xlsx"
    study_material_pdf_path = "docs/study_material.txt"

    # Get the supervisor user from the database
    supervisor = db_manager.get_user_by_username('supervisor')
    if supervisor:
        user_id = supervisor[0]
        # Run the crew
        main(feedback_pdf_path, job_description_pdf_path, excel_path, study_material_pdf_path, user_id)
