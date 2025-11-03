# Project Overview

This project is a simple web application to display a list of registered foreign contractors in Vietnam. It consists of a single HTML page that fetches and displays data from a JSON file. The data is originally sourced from a CSV file and converted to JSON using a PowerShell script.

## Key Files

*   `index.html`: The main web page that displays the contractor data. It includes HTML, CSS for styling, and JavaScript for fetching and filtering the data.
*   `registered_contractors.json`: The data file (in JSON format) that is loaded by the `index.html` page.
*   `registered_contractors.csv`: The original raw data of contractors in CSV format.
*   `convert.ps1`: A PowerShell script to convert the `registered_contractors.csv` file into the `registered_contractors.json` file.
*   `registered_contractors.xlsx`: An Excel file containing the same data as the CSV file.

## How to Use

1.  **Update the data (if necessary):**
    *   Modify the `registered_contractors.csv` file with the latest contractor information.
    *   Run the `convert.ps1` PowerShell script to update the `registered_contractors.json` file. You can run it from a PowerShell terminal with the following command:
        ```powershell
        .\convert.ps1
        ```
2.  **View the data:**
    *   Open the `index.html` file in a web browser to see the list of contractors. The page provides a search functionality to filter the list by company name or tax code.
