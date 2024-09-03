The Backend was deployedon render free plan, due to which after long inactive, first hit takes 50s. This can be modified with paid plan.

![Screenshot 2024-09-02 at 3 52 17 AM](https://github.com/user-attachments/assets/9b5014f2-d1ab-49cf-a1b4-6a21311a7ed5)

Select train -> coach

![Screenshot 2024-09-02 at 3 56 02 AM](https://github.com/user-attachments/assets/d9028aca-c0c6-4ba7-8209-493b2e703cf8)

ER Diagram for database relation

-> Table has one to many relation with Coach table
-> Coach table has one to many relation with Seat table.
-> Seat table has a composite key of [coachId,seatNumber]


![Screenshot 2024-09-02 at 4 02 10 AM](https://github.com/user-attachments/assets/84e5e2c4-a45f-49ab-814e-3d98068f9d0e)
