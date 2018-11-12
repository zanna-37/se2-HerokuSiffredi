# REST endpoints
- /tasks
    - **GET** *retrieve all tasks*
         - id
         - exerciseText
         - rightAnswer

         /tasks/{id}

    - **POST** *create new task*
         - exerciseText
         - rightAnswer
         - punteggio tot // TODO: è giusto metterlo? il punteggio potrebbe dipendere dall'esame
         - average // TODO: togliamola ??? è un casino con gli standard
    - **PUT** *create or update some tasks*
        - tasks[] -> list of (id, exerciseText, rightAnswer)

    - **DELETE** *delete all tasks*
        - _empty body_

- tasks/{id}
    - **GET** *retrieve specific task*
        - exerciseText
        - rightAnswer

    - **POST** *method not allowed (405)*

    - **PUT** *create or update task*
         - exerciseText
         - rightAnswer

    - **DELETE** *delete the task*
         - _empty body_

- /taskCategories
    - **GET** *retrieve existing task categories*
        - id
        - name

    - **POST** *create new task category*
        -  name

    - **PUT** *create or update some task categories*
         - taskCategory[] -> list of (id, name)

    - **DELETE** *delete all tasks category*
        - _empty body_

- /taskCategories/{id}
    - **GET** *retrieve existing task category*
        - name

    - **POST** *method not allowed*

    - **PUT** *create or update a task category*
         - id
         - name

    - **DELETE** *delete a task category*
        - _empty body_

- /users
    - **GET** *retrieve all users*
        - id
        - (studentNumber) //_matricola_
        - name
        - surname
        - average // NB: non si può settare la media, infatti in post e put non c'è

    - **POST** *create new user*
        - (studentNumber) //_matricola_
        - name
        - surname

    - **PUT** *create or update some users*
        - users[] -> list of (id, studentNumber, name, surname)

    - **DELETE** *delete all users* // TODO: LO METTIAMO VERAMENTE? CHI HA I PERMESSI PER FARLO?

- /users/{id}
    - **GET** *retrieve a user*
        - (studentNumber) //_matricola_
        - name
        - surname
        - average // NB: non si può settare la media, infatti in post e put non c'è

    - **POST** *method not allowed*

    - **PUT** *create or update user*
        - (studentNumber) //_matricola_
        - name
        - surname

    - **DELETE** *delete user*

- /groups
    - **GET** *retrieve all groups*
        - id
        - name
        - usersId[ ]

    - **POST** *create new group*
        - name
        - userId[]

    - **PUT** *create or update some grups*
        - group [] -> lis of (id , name, userId[])

    - **DELETE** *delete all groups*
        - _empty body_

- /groups/{id}
    - **GET** *retrieve a group*
        - id
        - name
        - usersId[ ]

    - **POST** *method not allowed*

    - **PUT** *create or update a grup*
        - id
        - name
        - userId[]

    - **DELETE** *delete a group*
        - _empty body_

- /courses //TODO: nome più specifico
    - **GET** *retrieve all courses*
        - id
        - name
        - annoAccademico // type = string (es "2018/2019")

    - **POST** *create a course*
        - name
        - annoAccademico

    - **PUT**
        - course[] -> list of (id, name, annoAccademico)

    - **DELETE**
        - empty body

- /courses/{id} //TODO: nome più specifico
    - **GET** *retrieve a course*
        - name
        - annoAccademico // type = string (es "2018/2019")

    - **POST** *method not allowed*

    - **PUT** *create or update a course*
        - name
        - annoAccademico

    - **DELETE** *delete a course*
        - empty body


- /exams //_ExamEvent_
    - **GET** *retrieve a list of exams*
        - id
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** *create an exam*
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end
    - **PUT** *create or update a list of courses*
        - id
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **DELETE** *delete all exams*
        - empty body

- /exams/{id}
    - **GET** *retrieve an exam*
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** *method not allowed*

    - **PUT** *create or update a course*
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **DELETE** *delete an exam*
        - empty body

- /examTemplates
    - **GET** *retrieve all exam templates*
        - id
        - name
        - domandeCerte[ ] // TODO: discutere se va bene (qui o su /exams/{id} ?)
        - idCategorie[ ]
        - quantità[ ]

    - **POST** *create new exam template*
        - name
        - domandeCerte[ ] // TODO: discutere
        - idCategorie[ ]
        - quantità[ ]

    - **PUT** *create or update exam templates*
        - list of -> (id, name, domandeCerte[ ], idCategorie[], quantità[ ])

    - **DELETE** *delete all exam templates*

- /examTemplates/{id}
    - **GET** *retrieve an exam template*
        - id //TODO: mettiamo l'id in tutti i get anche se già in URI?
        - name
        - domandeCerte[ ] // TODO: discutere se va bene (qui o su /exams/{id} ?)
        - idCategorie[ ]
        - quantità[ ]

    - **POST** *method not allowed*

    - **PUT** *create or update single exam template*
        - id
        - name
        - domandeCerte[ ]
        - idCategorie[ ]
        - quantità[ ]

    - **DELETE** *delete an exam template*





- /exams/{id}/tasks //specifica tutte le sub di tutti i task di un exam event
    - **GET** *retrieve all submissions of an exam of all students*
        - subId[]
        - tasksId[ ]
        - submissions[ ]

    - **POST** *method not allowed* //TODO: discuterne

    - **PUT** *method not allowed* //TODO: discuterne

    - **DELETE** *method not allowed* //TODO: discuterne

- /exams/{id}/tasks/{id} //specifica task di un exam event
    - submissions[ ]

    - **GET** *retrieve all submissions of a specific task of an exam event*
        - submissions[ ]

    - **POST** *method not allowed* //TODO: discuterne

    - **PUT** *method not allowed* //TODO: discuterne

    - **DELETE** *method not allowed* //TODO: discuterne

- /exams/{id}/users/{id} //_Atomic exam, collection of submissions per user_
    - **GET**
        - final evaluation
            - evaluator
            - final mark
            - comment
        - submissions[ ] -> list of//_Tutte quelle consegnate_
            - subId
            - taskId
            - answer
            - definitive mark
            - comment
            - proposers ids[ ] //_participants che hanno valutato la sub_
            - proposed mark[ ] //_voti da parte dei participants che hanno valutato la sub_

    - **POST** *method not allowed* //TODO: really?

    - **PUT** *method not allowed* //TODO: really?

    - **DELETE** *delete an atomic exam*

- /exams/{id}/users/{id}?task={id} //_Single task submission_
    - **GET**
        - subId
        - taskId
        - answer
        - definitive mark
        - comment
        - proposersIds[ ] //_participants che hanno valutato la sub_
        - proposedMarks[ ] //_voti da parte dei participants che hanno valutato la sub_

    - **POST** *submit a single task*
        - taskId
        - answer
        - definitive mark = null
        - comment = null
        - proposersIds[ ] = null
        - proposedMarks[ ] = null

    - **PATCH** *submit again (student)*
        - subId
        - taskId
        - answer

    - **PATCH** *correction (professor)*
        - subId
        - definitive mark
        - comment

    - **PATCH** *peer review (student)*
        - subId
        - proposersIds[ ] //TODO: come fare per non sovrascrivere?
        - proposedMarks[ ]
