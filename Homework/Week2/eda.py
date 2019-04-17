#!/usr/bin/env python
# Name: Jelle Westerbos
# Student number: 10755470
"""
This program read the input of a cvs file and creates a dataframe using pandas.
Next the program cleans the data and removes the outliers. This cleaned data
is written to a JSON file.
Finally the statistics are calculated it visualizes the data with a boxplot
and a histogram.
"""

import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


def create_dataframe():

    # Read csv file into pandas dataframe
    df = pd.read_csv('input.csv', usecols=['Country', 'Region',
                    'Pop. Density (per sq. mi.)',
                    'Infant mortality (per 1000 births)',
                    'GDP ($ per capita) dollars'])
    df.set_index('Country', inplace=True)

    return df


def clean_data(df):

    # Drop rows with unknown values and clean data
    df = df.dropna()
    df.drop(df[df['GDP ($ per capita) dollars'] == 'unknown'].index, inplace=True)
    df.drop(df[df['Pop. Density (per sq. mi.)'] == 'unknown'].index, inplace=True)
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].str.replace('dollars', '')
    df['Region'] = df['Region'].str.replace(" ", "")

    # Change strings into numeric values and delete dollars from GDP column
    df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)']\
                                         .str.replace(",", ".").astype(float)
    df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)']\
                                                 .str.replace(",", ".").astype(float)
    df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(float)

    # Remove outliers (only surime with)
    df.drop(df[df['GDP ($ per capita) dollars'] == 400000.0].index, inplace=True)

    return df


def statistics(cleaned_data):

    # Calculate mean, median and mode GDP per capita worldwide
    print('Descriptives of GDP per capita worldwide')
    print(cleaned_data['GDP ($ per capita) dollars'].describe())

    # Calculate Five Number summary of Infant mortality (per 1000 births)
    infant_data = cleaned_data['Infant mortality (per 1000 births)']
    print('Five number summary of Infant mortality (per 1000 births)')
    print('min:', np.min(infant_data))
    print('max:', np.max(infant_data))
    print('std:', np.std(infant_data))
    print('mean:', np.mean(infant_data))
    print('median:', np.median(infant_data))

    # Create Histogram of GDP per capita in $
    fig, axs = plt.subplots(1, 2, constrained_layout=True)
    axs[0].hist(cleaned_data['GDP ($ per capita) dollars'], bins=30)
    axs[0].set_title('GDP ($ per capita) dollars')
    axs[0].set_xlabel('GDP ($ per capita) dollars')
    axs[0].set_ylabel('Number of countries')
    fig.suptitle('GDP per capita & Infant mortality', fontsize=16)

    # Create boxplot of Infant mortality per 1000 births
    axs[1].boxplot(cleaned_data['Infant mortality (per 1000 births)'])
    axs[1].set_title('Boxplot of infant mortality')
    axs[1].set_xlabel('Infant mortality (per 1000 births)')
    axs[1].set_ylabel('Number of dead infants')
    plt.show()


def write_json(cleaned_data):
    # Export dataframe to JSON file
    cleaned_data.to_json('demographics.json', orient='index')


if __name__ == "__main__":

    df = create_dataframe()

    cleaned_data = clean_data(df)
    print(cleaned_data)
    statistics(cleaned_data)
    write_json(cleaned_data)
