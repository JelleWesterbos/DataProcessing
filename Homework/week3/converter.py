import csv
import json

# Open the CSV
f = open('global-plastics-production.csv', 'rU')

# Change each fieldname to the appropriate field name. I know, so difficult.
reader = csv.DictReader( f, fieldnames = ( "Entity","Code","Year","Global plastics production (million tonnes) (tonnes)" ))

# Parse the CSV into JSON
out = json.dumps( [ row for row in reader ] )
print ("JSON parsed!")

# Save the JSON
f = open('global-plastics-production.json', 'w')
f.write(out)
print ("JSON saved!")
