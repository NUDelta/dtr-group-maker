# DTR Group Maker
Splits the class into two groups for Pair Research and LIP. Respects pairings and preferred LIP groups
[Demo](http://users.eecs.northwestern.edu/~hq/dtr-group-maker/hq.html)
===

During [DTR](http://dtr.northwestern.edu) Studio Meetings, to give mentors more time to work with students directly on [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing), we split the class into two groups:
- Group A works on [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing) in the first hour, and [Pair Research](http://pairresearch.io) in the second hour.
- Group B works on [Pair Research](http://pairresearch.io) in the first hour, and [LIPs](https://docs.google.com/presentation/d/1HyF1nBkCXPEkq6xRES_pJXdHECz0Y1NzOQSDPF1WtaY/edit?usp=sharing) in the second hour.

This tool helps us make these two groups by:
- Respecting all pair research matchings, so that students who are paired will always be in the same group.
- Preferring all LIP groups, so that students working on the same LIP are put in the same group whenever possible.

The tool does this by computing all near-even partitions and identifies candidate partitions that fully respects pair researching matches and prefers LIP groupings as able.
  
  

###### Note: to fully respect pair research matchings, we must allow for unequal group sizes; for example, if there are 10 students paired, then groups should have 4/6 people instead of 5/5.
