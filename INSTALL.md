
# Trace - Installation and Use
## To Install the Project:
1. Clone our project locally or download the **main** branch of our project from Github.
2. If you do not have Node.js installed, navigate to the provided link and download your operating system's relevant Node.js installer, then run it and follow the process to to completion:
    - [Node.js Installation Page](https://nodejs.org/en/download/)
3. If you do not have the Angular CLI installed, open your computer's Command Line and run the following command:
    - `npm install -g @angular/cli`
4. If you do not have Python 3 installed, go to the following link and install it.  When prompted during installation, select the option to set PATH variables to use it in the terminal.
    - [Python Download Page](https://www.python.org/downloads/)
    - To test that your Python installation works, open up your terminal and type `py`.  Type `exit()` to exit the Python Shell if it works.
    - To test that PIP works, open up your terminal and type `pip`.  If it works, it'll display all of the different ways to use PIP.
5. You should have everything you need to use the project now.

## To Use the Project:
1. Open your computer's Command Line twice and and navigate to the containing the downloaded project on both terminals.
2. On one of the terminals, run `npm install` to ensure you have the requisite Node modules for the proejct to work.
3. On one of the terminals, navigate to /python, then run `pip install -r requirements.txt` to install all of the Python code's dependencies.  Once done, navigate back to /Trace and proceed to step 4.
4. On one of the terminals, run `node server` to start up the project's backend.
    - You can use the project's API from http://localhost:3000.
    - See API.md for more details.
5. On the other terminal, run `ng serve` to start up the project's frontend.
    - You can connect to the page's frontend normally at http://localhost:4200.
