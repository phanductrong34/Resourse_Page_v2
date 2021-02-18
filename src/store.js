/*
LƯU TRỮ DATA CỦA APP
*/

import uniqid from 'uniqid';

class Group{
    constructor(alias,dateCreated,dayOccur,time,courseType) {
        this.groupID = uniqid('g-');
        this.groupALias = alias;
        this.dateCreated = dateCreated;
        this.dateCreated = dateCreated;
        this.dayOccur = dayOccur;
        this.time = time;
        this.courseID = null;
        this.lessonUnlock = {};
        this.courseType = courseType;
        this.imageURL = this.convertURL()


        //Auto run
        // this.init = addEdgeCourse(courseType);
    }
    convertURL(){
        return `./assets/png/card-${this.courseType}.png`
    }

    toogleLockLesson(number) {
        if(number <= 8 && number > 0){
            !this.lessonUnlock[number]
            ? this.lessonUnlock[number] = 1
            : this.lessonUnlock[number] = 0    
        }
    }
    
}

class Course{
    constructor(courseType, courseName) {
        this.courseID = uniqid('c-');
        this.courseType = courseType;
        this.courseName = courseName;
        this.courseLessons = [];
        this.courseResource = [];
    }
    addLesson(lesson) {
        this.courseResource.push(lesson);
    }
    addResource(resource){
        this.courseResource.push(resource);
    }     
}
export default {
    courses : [
        new Course("ae","Advanved Animation"),
        new Course("ai","Advanved Ilustrator"),
    ],
    groups : [
        new Group("MT01","22/9/2020","T3-T5","6h45-8h45","ae"),
        new Group("MT02","22/10/2020","T3-T5","6h45-8h45","ae"),
        new Group("MT03","22/11/2020","T3-T5","6h45-8h45","ae"),
        new Group("MT04","22/12/2020","T3-T5","6h45-8h45","ae"),
        new Group("AI01","22/11/2020","T3-T5","6h45-8h45","ai"),
        new Group("AI02","22/12/2020","T3-T5","6h45-8h45","ai"),
        new Group("AI03","22/1/2021","T3-T5","6h45-8h45","ai")
    ]

}


class File{
    constructor(name,type,url){
        this.fileID = uniqid('f-');
        this.fileName = name;
        this.fileType = type;
        this.fileURL = url;
    }
}

class Student{
    constructor(alias,email){
        this.studentID = uniqid('s-');
        this.studentAlias = alias;
        this.studentEmail = email;
        
    }
}

class StudentInClass extends Student {
    constructor(alias,email,groupID){
        super(alias,email);
        this.workIDs = [];
        this.totalStars =0;
        this.latestLesson = 0;
        this.totalSubmit = 0;
        this.init = addToGroup(groupID);
    }
    addToGroup(groupID){
        // tìm tối mã group và add vào
    }
    calTotalStars(){
        
    };
    calTotalSubmit(){

    }
    calLatestLesson(){
        
    }

}
