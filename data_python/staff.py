# Python program that calculate the average and lowest salary
import csv  # Import csv file
file = open("employees.csv", "r")
try:
    reader = csv.DictReader(file)
    manager_list_salary = []  # create an empty list
    lowest_salary = 1000000000
    lowest_salary_row = 0
    for row in reader:
        salary = int(row["salary"])  # convert row to numbers
        if row["employee_type"] == "Manager":  # for loop to calculate manager average salary
            manager_list_salary.append(salary)  # append elements in list
            average = int(sum(manager_list_salary) / len(manager_list_salary))  # calculate the average

        if salary < lowest_salary:  # for loop to find the lowest salary and get entire row
            lowest_salary = salary
            lowest_salary_row = row

    print(f"The average salary of managers is {average:,d} dollars.")  # format output using f-string
    print(f"{lowest_salary_row['first_name']} {lowest_salary_row['last_name']} " 
          f"has the lowest salary (${lowest_salary:.2f}).")
finally:
    file.close()
