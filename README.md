Spring 2022 140L Final Project
Author: Reet Mishra

# Construction File Generator for Promotor Swap Experiment

This package generates a zip file of construction files for a Promotor Swap experiment. The goal of this package is to provide an easy-to-use and somewhat automated interface to produce these construction files.  

Some things to keep in mind:

1. Currently, this version of the package runs on a python hosted server.
2. The input .tsv file has to be specified as listed below and in index.html
3. This package has not been tested on a Windows environment, currenly only has been tested on MacOS. More testing in different aspects would be preferred as well.
4. I also offer a "CheckOligo" feature as an extra verification step. 

# Webpage Design

This webpage takes in a user-specified input file with a list of primers and more information about each for a Promotor Swap experiment. 
It also takes in the prototype plasmid name or backbone plasmid name as an input. 
Only after acquiring both pieces of information and clicking "Submit", my algorithm parses through the file contents and generates a construction file for
each row in the original input file. 
Finally, users can click the "Download ZIP" button to locally download a ZIP file containing all the construction files. The construction files are named as "Construction of pLycBm.txt" for example where pLycBm is a plasmid product. 

Users also have the option after clicking "Submit" to verify the primers that have been selected. This tool does a loose check of some important characteristics of good primer designs. I do not restrict construction file generation based on the output of this however, to allow for manual override. Once users click the "Check Primers" button they will get an output printed below the buttom on which checks passed and failed for each row in the input file.


# 1. Installation and Running

In order to run this package, first download this repo as a zip file.
Next, open a python http server by running the following command:
```
$ cd constructionFileGenerator/
$ python -m http.server
```
Finally, open a window on your browser (currently only Google Chrome is tested) and paste the following link as the URL
http://localhost:8000/index.html

Note: Most of the output will be visible on the webpage itself. However, for more details you can also right-click on the webpage and select "Inspect" Here, if you go to the "Console" pane you may be able to find more information about different variables and parts in case you need to debug.

# 2. Input File
The input file must be a .tsv file and have the same column names as specifiecd on index.html. For an example, see "example2.tsv"
Click on the "Choose a file" button to upload a file from your computer locally.

Column names must be in the following order:

- "p1name": primer 1 name
- "p2name": primer 2 name
- "p1seq": primer 1 sequence
- "p2seq": primer 2 sequence
- "p1amount": primer 1 amount in nm
- "p2amount": primer 2 amount in nm
- "p1pur": primer 1 purification strategy
- "p2pur": primer 2 purification strategy
- "p1desc": primer 1 description
- "p2desc": primer 2 description
- "label": label name after PCR
- "gname": name of genome as labelled in inventory
- "gseq": genome sequence
- "plasmidName": plasmid product name

# 3. Output Files
After choosing an input file and entering the prototype plasmid name, users can click on the "Download ZIP" button to download a ZIP file of all the construction files generated. On MacOS, the zip file defaults to the "/Users/username/Downloads/" folder. To see the contents of the files, users must then manually unzip the .zip file and a folder with all the files should be available at that point.

# 4. Check Primers
This is an additional feature I thought to include to help users with this entire process. Currently, this feature does a rough check of 4 major components for each primer. 

1. If each primer sequence has a BsaI site. In order to simply the software I have chosen to only include BsaI sites.
2. If the length of each primer sequence is between 18-40bp, which is a loose restriction. 
3. If the GC content for each primer is greater than 40%
4. If each primer does not have 4 or more nucleotide or dinucleotide repeats

I provide a detailed output for whether each primer passes or fails these checks. If in a row, both primers pass all checks the message "All primers checked! Nothing to worry about." is printed. 

# Required packages
Required pacakges include: FileSaver.js and JSZip.js that were included from the internet. Everything else I have coded.

# Examples
To see an example of the output and webpage, navigate to the "Example" directory which has screenshots and the example.tsv file used to generate that output.
