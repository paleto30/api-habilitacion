

export const getTheEnablementEmailTemplate = (student, nameSubject, reference, teacher, fecha) => {
    let studentName = `${student.nombre} ${student.apellido}`;
    let teacherName = `${teacher.nombre} ${teacher.apellido}`;
    return /*html*/`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Información sobre Solicitud de Habilitación.</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                }
        
                header {
                    background-color: #589C0A;
                    color: #fff;
                    text-align: center;
                    padding: 10px;
                }
        
                section {
                    margin-top: 20px;
                }
        
                footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #777;
                }
            </style>
        </head>
        <body>
        
            <header>
                <h3>Información sobre Solicitud de Habilitación.</h3>
            </header>
        
            <section>
                <p>Estimado/a <strong>${studentName}</strong>,</p>
        
                <p>Esperamos se encuentre bien. Queremos informarle que su solicitud de habilitación de la materia <strong>${nameSubject}</strong> fue aceptada.</p>
        
                <p>Detalles de la Solicitud:</p>
                <ul>
                    <li><strong>Referencia:</strong> ${reference}</li>
                    <li><strong>Fecha de aprovacion:</strong> ${fecha}</li>
                    <li><strong>Docente Encargado:</strong> ${teacherName}</li>
                    <li><strong>Correo del docente:</strong> ${teacher.correo}</li>
                </ul>
        
                <p>Apartir de la fecha de aprovación el Docente tiene el deber de comunicarse con usted vía correo institucional para darle las indicaciones de la habilitación.</p>
        
                <p>Si en 3 dias no recibe comunicacion del docente, favor acercarse a su respectiva coordinación y comentar la situación.</p>
            </section>
        
            <footer>
                <p>© Unidades Tecnológicas de Santander. Todos los derechos reservados.</p>
            </footer>
        
        </body>
        </html>
    `;
}



export const getTemplateToSendTeacher = (teacher, student, nameSubject, reference, fecha) => {
    let studentName = `${student.nombre} ${student.apellido}`;
    let teacherName = `${teacher.nombre} ${teacher.apellido}`;
    return /*html*/`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de Habilitación de Materia.</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 20px;
            }
    
            header {
                background-color: #589C0A;
                color: #fff;
                text-align: center;
                padding: 10px;
            }
    
            section {
                margin-top: 20px;
            }
    
            footer {
                margin-top: 20px;
                text-align: center;
                color: #777;
            }
        </style>
    </head>
    <body>
    
        <header>
            <h1>Solicitud de Habilitación de Materia.</h1>
        </header>
    
        <section>
            <p>Estimado/a <strong>${teacherName}</strong>,</p>
    
            <p>Esperamos se encuentre bien. Queremos informarle sobre la aprovación de la solicitud de habilitación de su materia <strong>${nameSubject}</strong> para el estudiante <strong>${studentName}</strong>.</p>
            
            <p>Sin embargo queremos que rectifique si el estudiante cumple con la calificación necesaria para acceder al examen de habilitación, de lo contrario informar a la cordinacioón y al estudiante vía correo institucional el motivo por el cual NO es apto para presentar el examen.</p>
            
            <p>Detalles de la Solicitud:</p>
            <ul>
                <li><strong>Número de Solicitud:</strong> ${reference}</li>
                <li><strong>Fecha de Solicitud:</strong> ${fecha} </li>
                <li><strong>Estudiante:</strong> ${studentName}</li>
                <li><strong>DNI de estudiante:</strong> ${student.doc_id}</li>
                <li><strong>Correo estudiante:</strong> ${student.correo}</li>
            </ul>
    
            <p>Si el estudiante ${studentName} cumple con el requisito de la calificación sobre 2.0, Debe comunicarle vía correo las respectivas indicaciones del examen, en los proximos 3 dias hábiles.</p>
    
            <p>Agradecemos su servicio y atención.</p>

        </section>
    
        <footer>
            <p>© Unidades Tecnológicas de Santander. Todos los derechos reservados.</p>
        </footer>
    
    </body>
    </html>
    
    `;
}