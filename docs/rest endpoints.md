# REST endpoints
- /tasks/
    - id
    - exerciseText

- /taskCategories/
    - id
    - name

- /users/
    - id
    - (studentNumber)
    - name
    - surname

- /groups/
    - id
    - name
    - usersId[ ]
- /courses/ //TODO: nome più specifico
    - id
    - name
    - annoAccademico //TODO: come fare? l'anno accademico è a cavallo di 2 anni
- /exams/ //_ExamEvent_
    - examTemplateId
    - (avg mark)
    - defaultDeadline
        - start
        - end

- /exams/{id}/tasks/{id}
    - submissions

- /exams/{id}/users/{id} //_Atomic exam_
    - evaluation
        - evaluator
        - mark
        - comment
    - submissions //_Tutte quelle consegnate_

- /exams/{id}/user/{id}?task={id}

- /examTemplates/{id}
    - id
    - name
 
