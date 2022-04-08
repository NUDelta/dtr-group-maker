# DTR Group Maker
**[Demo](http://users.eecs.northwestern.edu/~hq/dtr-group-maker/hq.html)**

Splits the class into two groups for Pair Research and LIP. Respects Pair Research pairings and project teams, and attempts respect preferred LIP groups. 

<img src="/images/screenshot.png?raw=true" width="400px">

## Purpose
During [DTR](http://dtr.northwestern.edu) Studio Meetings, to give mentors more time to work with students directly on [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing), we split the class into two groups:
- Group A works on [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing) in the first hour, and [Pair Research](http://pairresearch.io) in the second hour.
- Group B works on [Pair Research](http://pairresearch.io) in the first hour, and [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing) in the second hour.

This tool helps us make these two groups by:
- Respecting all Pair Research matchings and project teams, so that students who are paired will always be in the same group and project teams will be able to work together during LIP.
- Preferring all LIP groups, so that students working on the same LIP are put in the same group whenever possible.
- Attempt to keep the size of each partition equal
- Attempt to keep equal number of PhD students in each partition to not have many more undergrads in one partition

The tool does this by computing all near-even partitions and identifies candidate partitions that fully respects Pair Research matches and project teams. Then, partitions are scored and sorted based on: (1) how well partitions maintain LIP groupings; (2) how equal in size partitions are; and (3) how equal the number of PhD students between partitions is. _Note: to fully respect Pair Research matchings and project teams, we must allow for unequal group sizes; for example, if there are 10 students paired, then groups could have 4/6 people instead of 5/5._

## Usage
1. Click "add all teams" to add all project teams.
2. Type in individual pairings into the first text box, and add them by clicking "add pair research pairing". **All students present in DTR during class must be added, including those not paired or not doing Pair Research. Otherwise, they will not appear in the generated groups.**
3. Type in all students working on the same LIP into the second text box, and add them by clicking "add LIP group".
4. If needed during steps 3 and 4, click the "X" next to the Pairing, Team, or LIP Grouping to remove it (for instance, if a project team is not in DTR one week). 
5. Click "Make Groups" to generate two Groups for LIP and Pair Research (this may take a couple seconds). Group A will always be the larger of the two groups if groups are not equal in size. 

## Setup
1. Make sure you have [Node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) installed.
2. Create a `.env` file as follows:
    ```
   NODE_ENV=development
   PORT=3000
    ```
## Development
1. Run `yarn` to download the necessary packages.
2. Run `yarn run dev` to start the local Node.js application.

## Deployment
For production, use the following environment variables:
```
NODE_ENV=production
PORT=8080
```