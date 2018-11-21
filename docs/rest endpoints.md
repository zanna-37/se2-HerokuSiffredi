# REST endpoints
- /tasks
    - **GET** _retrieve all tasks_
        - tasks[ ]

    - **POST** _create new task_
         - exerciseText
         - answers[ ]
             - answer
             - isRight
         - ~~spiegazione~~
         - categoryId
         - punteggio tot // TODO-MINOR: il punteggio potrebbe dipendere dall'esame
         - ultima modifica
                 
    - **PUT** _update some tasks (one or more)_
        - tasks[ ]

    - **DELETE** _delete all tasks in the list_ 
        - taskIds[ ] -> list of id

- /tasks/{id}
    - **GET** _retrieve specific task_
        - id
         - exerciseText
         - answers[ ]
             - answer
             - isRight
         - ~~spiegazione~~
         - categoryId
         - punteggio tot
         - ultima modifica
    
    - **POST** _method not allowed (error: 405)_
    
    - **PUT** *update task*
         - exerciseText
         - answers[ ]
             - answer
             - isRight
         - ~~spiegazione~~
         - categoryId
         - punteggio tot // TODO-MINOR: il punteggio potrebbe dipendere dall'esame
 
    - **DELETE** _delete the task_
         - _empty body_

- /task-categories
    - **GET** _retrieve existing task categories_
        - id
        - name

    - **POST** _create new task category_
        -  name

    - **PUT** _update some task categories_
         - taskCategory[ ] -> list of (id, name)

    - **DELETE** _delete all tasks category in a list_
        - taskCategoryId[ ]

- /task-categories/{id}
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

- /exam-templates
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
        - ownersIds[ ]
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** _create an exam_
        - examTemplateId
        - ownersIds[ ]
        - (avg mark)
        - defaultDeadline
            - start
            - end
        
    - **PUT** _update a list of courses_
        - id
        - examTemplateId
        - ownersIds[ ]
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
        - ownersIds[ ]
        - (avg mark)
        - defaultDeadline
            - start
            - end

    - **POST** _method not allowed (error: 405)_
    
    - **PUT** _update a course_
        - examTemplateId
        - ownersIds[ ]
        - (avg mark)
        - defaultDeadline
            - start
            - end
    
    - **DELETE** _delete an exam_
        - empty body
        
- /submissions
    - **POST** __
        - examId
        - subId
        - userId
        - assignedTaskId
        - userAnswer
        - (finalCorrectionId) // quando è a null, non si mette proprio

    - **PUT** __
    
    - **DELETE** __


- /submissions/{id}
    - **GET** _retrieve a submission_
        - examId
        - subId
        - userId
        - assignedTaskId
        - userAnswer
        - finalCorrectionId

    - **POST** _method not allowed_
         
    - **PUT** __ // studente e professore passano campi diversi 
        - examId
        - subId
        - userId
        - assignedTaskId
        - userAnswer
        - (finalCorrectionId) // quando è a null, non si mette proprio
    
    - **DELETE** delete a submission_
        - empty body

    - **PATCH** _submit again (student)_
        - subId
        - taskId
        - answer

    - **PATCH** _correction (professor)_
        - subId
        - finalCorrectionId

- /task-corrections
    - **GET** _retrieve all the correction proposals for an exam_
        - taskCorrections[ ]

    - **POST** _create a correction proposal_
        - subId
        - examId
        - mark
        - comment
        - proposerUserId

    - **PUT** _update a list of correction proposals_
        - taskCorrections[ ]
    
    - **DELETE** _delete list of correction proposals_
        - correctionsIds[ ] 

- /task-corrections/{id}
    - **GET** _retrieve a proposal corrections for an exam_
        - id
        - subId
        - examId
        - mark
        - comment
        - proposerUserId

    - **POST** _method not allowed (error: 405)_

    - **PUT** _update single correction proposal_
        - subId
        - examId
        - mark
        - comment
        - proposerUserId
    
    - **DELETE** _delete a correction proposal_
        - empty body

- /exam-instances
    - **GET**
        - userIds[ ]
        - examId
        - assignedTaskIds[ ]
        - final evaluation[ ]
            - evaluatorUserId
            - final mark
            - comment
    
    - **POST** _assign an exam to a user_
        - userIds[ ]
        - examId
        - assignedTaskIds[ ] // In realtà si passano le taskIds che verranno copiate in assigned task

    - **PUT** _assign an exam to a user_

        - list of:
            - userIds[ ]
            - examId
            - taskIds[ ]

    - **DELETE** _delete an atomic exam_
        - empty body

- /exam-instances/{id} _retrieve an atomic exam_
    - **GET**
        - userIds[ ]
        - examId
        - final evaluation
            - evaluatorUserId
            - final mark
            - comment
        - assignedTaskIds[ ]
    
    - **PUT** _si fa sulla sub_
    
    - **PATCH** (professor)
        - final evaluation
            - evaluatorUserId
            - final mark
            - comment

- /users/{id}/exams _carriera dell'utente_

- /assigned-tasks/{id}
    - **GET**
        - assignedTaskId
        - task (copia spaccata immodificabile)