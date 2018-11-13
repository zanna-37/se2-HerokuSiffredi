# REST endpoints
- /tasks
    - **GET** _retrieve all tasks_
         - id
         - exerciseText
         - rightAnswer
         - categoryId

    - **POST** _create new task_
         - exerciseText
         - rightAnswer
         - punteggio tot // TODO-MINOR: il punteggio potrebbe dipendere dall'esame
         - average // TODO-MINOR: related with punteggio tot ↑
         - categoryId

    - **PUT** _update some tasks (one or more)_
        - tasks[ ] -> list of (id, exerciseText, rightAnswer, categoryId)

    - **DELETE** _delete all tasks in the list_
        - taskIds[ ]

- /tasks/{id}
    - **GET** _retrieve specific task_
        - id
        - exerciseText
        - (rightAnswer)
        - (punteggio tot) //TODO: vedi sopra
        - (average) // TODO-MINOR: related with punteggio tot ↑
        - categoryId

    - **POST** _method not allowed (error: 405)_

    - **PUT** *update task*
        - exerciseText
        - rightAnswer
        - punteggio tot //TODO: vedi sopra
        - ~~average (va modificata a backend, magari azzerandola)~~
        - categoryId

    - **DELETE** _delete the task_
         - _empty body_

- /taskCategories
    - **GET** _retrieve existing task categories_
        - id
        - name

    - **POST** _create new task category_
        -  name

    - **PUT** _update some task categories_
         - taskCategory[ ] -> list of (id, name)

    - **DELETE** _delete all tasks category in a list_
        - taskCategoryId[ ]

- /taskCategories/{id}
    - **GET** _retrieve existing task category_
        - id
        - name

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update a task category_
         - name

    - **DELETE** _delete a task category_
        - _empty body_

- /users
    - **GET** _retrieve all users_
        - id
        - (studentNumber) //_matricola_
        - name
        - surname
        - average // NB: non si può settare la media, infatti in post e put non c'è

    - **POST** _create new user_
        - (studentNumber) //_matricola_
        - name
        - surname

    - **PUT** _update some users_
        - users[ ] -> list of {id, studentNumber, name, surname}

    - **DELETE** _delete all users in the list_
        - userIds[ ]

- /users/{id}
    - **GET** _retrieve a user_
        - id
        - (studentNumber) //_matricola_
        - name
        - surname
        - average // NB: non si può settare la media, infatti in post e put non c'è

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update user_
        - (studentNumber) //_matricola_
        - name
        - surname

    - **DELETE** _delete user_
        - _empty body_

- /groups
    - **GET** _retrieve all groups_
        - id
        - name
        - usersIds[ ]

    - **POST** _create new group_
        - name
        - userId[ ]

    - **PUT** _update some grups_
        - group[ ] -> list of { id, name, userId[ ] }

    - **DELETE** _delete all groups in the list_
        - groupIds[ ]

- /groups/{id}
    - **GET** _retrieve a group_
        - id
        - name
        - usersIds[ ]

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update a group-
        - id
        - name
        - userId[ ]

    - **DELETE** _delete a group_
        - _empty body_

- /courses //TODO: nome più specifico
    - **GET** _retrieve all courses_
        - id
        - name
        - annoAccademico // type = string (es "2018/2019")

    - **POST** _create a course_
        - name
        - annoAccademico

    - **PUT**
        - course[ ] -> list of { id, name, annoAccademico }

    - **DELETE** _delete all groups in the list_
        - coursesId[ ]

- /courses/{id} //TODO: nome più specifico
    - **GET** _retrieve a course_
        - id
        - name
        - annoAccademico // type = string (es "2018/2019")

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update a course_
        - name
        - annoAccademico

    - **DELETE** _delete a course_
        - empty body

- /examTemplates
    - **GET** _retrieve all exam templates_
        - id
        - name
        - idCategorie[ ]
        - quantità[ ]

    - **POST** _create new exam template_
        - name
        - categoryIds[ ]
        - quantity[ ]

    - **PUT** _update exam templates_
        - list of -> {id, name, idCategorie[ ], quantità[ ]}

    - **DELETE** _delete exam templates of a list_
        - examTemplateIds[ ]

- /examTemplates/{id}
    - **GET** _retrieve an exam template_
        - id
        - name
        - categoryIds[ ]
        - quantity[ ]

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update single exam template_
        - id
        - name
        - categoryIds[ ]
        - quantity[ ]

    - **DELETE** _delete an exam template_

- /exams //_ExamEvent_
    - **GET** _retrieve a list of exams_
        - id
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** _create an exam_
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **PUT** _update a list of courses_
        - id
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **DELETE** _delete all exams in the list
        - examsIds[ ]

- /exams/{id}
    - **GET** _retrieve an exam_
        - id
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update a course_
        - examTemplateId
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **DELETE** _delete an exam_
        - empty body

- /exams/{id}/tasks/{id} //tutte le sub di tutti gli utenti di una specifica task di un exam event
    - submissions[ ]
        - answerText

    - **GET** _retrieve all submissions of a specific task of an exam event_
        - submissions[ ]

    - **POST** _method not allowed (error: 405)_ //TODO: discuterne

    - **PUT** _method not allowed (error: 405)_ //TODO: discuterne

    - **DELETE** _method not allowed (error: 405)_ //TODO: discuterne

//TODO-QUESTION: decidere se è meglio fare su "/submissions" o come sotto

- /exams/{id}/task-submissions?user={id}
- /exams/{id}/task-submissions/{id}



- /exams/{id}/task-submissions //_Single task submission_
    - **GET**
        - list of:
            - subId
            - userId
            - taskId
            - answer
            - finalCorrectionId

    - **POST** _submit a single task_
        - userId
        - taskId
        - answer
        - ~~finalCorrectionId = null~~ //TODO-QUESTION: possiamo non passarla e metterla a null da server?

    - **PATCH** _submit again (student)_
        - subId
        - taskId
        - answer

    - **PATCH** _correction (professor)_
        - subId
        - finalCorrectionId

- /exams/{id}/task-corrections
    - **GET** _retrieve all the correction proposals for an exam_
        - listof:
            - id
            - mark
            - comment
            - proposerUserId

    - **POST** _create a correction proposal_
        - subId
        - mark
        - comment
        - proposerUserId

    - **PUT** _update a list of correction proposals_
        - list of:
            - id
            - mark
            - comment
            - proposerUserId

    - **DELETE** _delete list of correction proposals_
        - correctionsIds[ ]

- /exams/{id}/task-corrections/{id}
    - **GET** _retrieve a proposal corrections for an exam_
        - id
        - mark
        - comment
        - proposerUserId

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update single correction proposal_
        - mark
        - comment
        - proposerUserId

    - **DELETE** _delete a correction proposal_
        - empty body

- /exams/{id}/participants _Assign atomic exam to a list of users_
    - **GET**
        - atomicExamId
        - participantId[ ]
        - examId
        - final evaluation
            - evaluatorUserId
            - final mark
            - comment
        - taskIds[ ]

    - **POST** _create an Atomic Exam for a user_
        - userId
        - examId
        - ~~final evaluation = null~~ //TODO-QUESTION: possiamo non passarla e metterla a null da server?
        - taskIds[ ]

    - **PATCH** (professor)
        - final evaluation
            - evaluatorUserId
            - final mark
            - comment

    - **DELETE** _delete an atomic exam_
        -    empty body

~~- /exams/{id}/course/{id} _Assign atomic exam to a course_
    - **POST** _create an Atomic Exam for a course_
        - courseId
        - examId~~

- /users/{id}/exams

