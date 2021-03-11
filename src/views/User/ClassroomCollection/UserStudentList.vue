<template>
    <div class="student-list">
        <div :class="[{active: student.id == activeStudentID},'student-card']" 
            v-for="student in students" 
            :key="student.id" 
            @click="activateStudent(student)">
                <div class="student-ava">
                    <div class="ava-container"><Image class="ava" :refUrl="student.avaRef"/></div>
                </div>
                <div class="student-nickname">{{computedName(student.nickname)}}</div>
                <div class="student-submit">
                    <span class="student-icon"><i class="material-icons">arrow_drop_up</i></span>
                    <span class="student-works">{{computedSubmit(student.works.length)}}</span>
                </div>
        </div>

    </div>
</template>

<script>
    import {ref} from 'vue'
    export default {
        props: ['students','activeStudentID'],
        components:{
            
        },
        setup(props,context) {

            const computedSubmit = (submit)=>{
                if(submit < 2) return submit +' submit';
                else return submit +' submits'
            }
            const computedName = (name)=>{
                return name.replaceAll(/\s/g,'')+'.'
            }

            const activateStudent = (student)=>{
                context.emit('showWorks',student);
            }

            return {computedSubmit,computedName,activateStudent};
        }
    }   
</script>

<style lang="scss" scoped>
.student-list{
    display: flex;
    flex-wrap: wrap;
    padding: 2.5rem 1rem 0rem 1rem;
    min-height: 260px;
    width: 73%;
    // background-color: violet;
}

.student{
    &-card{
  -webkit-backface-visibility: hidden; /* add to fix webkit bug jitter */
  -webkit-transform: perspective(1000px); /* add to fix webkit bug jitter */
        position: relative;
        padding: 0.6rem 1.5rem 0.6rem 1rem;
        background-color: white;
        @include card-shadow-1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 0 1.5rem 2.5rem 0;
        min-width: 9rem;
        max-height: 74px;
        border-radius: 0.7rem;
        @include transition;
        z-index: 1;

        &:hover{
            cursor: pointer;
            transform: scale(1.05);
        }
        &.active{
            &::after{
                content: "";
                position: absolute;
                width: 101%;
                height: 101%;
                top: 0;
                left: 0;
                z-index: -2;
                border-radius: 0.7rem;
                border: 2px solid $color-primary;
            }
        }
    }

    &-nickname{
        font-family: "Averta Black";
        font-size: 1.2rem;
    }
    &-submit{
        display: flex;
        justify-content: center;
        color: $color-gray-dark;
    }
    &-icon{
        transform: rotate(90deg) translateX(-3px);
    }

//////////////////// AVATA
    &-ava{
        position: absolute;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        top: 10%;
        left: 10%;
        transform: translate(-50%,-50%);
        background-color: $color-primary;
        @include transition;
    }
}
.ava-container{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    border-radius: 10rem;
    display:flex;
    justify-content: center;
    overflow: hidden;
    
}
.ava{
    width: 100%;
    transform: translateY(1rem) scale(0.9);

}
</style>