#!/usr/bin/env python
# Name: Jelle Westerbos
# Student number: 10755470

"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt


# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Open and read csv file
with open (INPUT_CSV, 'r') as csvfile:
    reader = csv.DictReader(csvfile)

# Append rating to year to dictionary
    for line in reader:
        data_dict[line['year']].append(float(line['rating']))

# Find average rating per year
averages = {}
for k,v in data_dict.items():
    # v is the list of ratings for year k
    averages[k] = sum(v)/ float(len(v))
x,y = zip(*sorted(averages.items()))


if __name__ == "__main__":

# Create and show plot
    plt.plot(x,y)
    plt.title('Avg rating top 50 IMDB movies between 2008 - 2018')
    plt.xlabel('Year')
    plt.ylabel('Rating')
    plt.show()
