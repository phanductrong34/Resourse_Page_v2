<template>
    <div class="info-card">

        <div class="card">
            <div class="nickname">{{student.nickname}}</div>
            <h5 class="fullname">{{student.fullname || 'Somebody😂'}}</h5>
            <div class="phone info">
                <p class="title">Phone</p>
                <p class="content">{{formatPhone(student.phone) || 'not found'}}</p>
            </div>
            <div class="email info">
                <p class="title">Email</p>
                <p class="content">{{formatEmail(student.email) || 'not found'}}</p>               
            </div>
        </div>
    </div>
</template>

<script>
    import {ref,watchEffect,computed} from 'vue'
    export default {
        props:['student'],
        setup(props) {
            const currentType = ref('password');

            watchEffect(()=>{
                const newID = props.student.id;
                currentType.value = 'password';
            })
            const toggleVisible = ()=>{
                if(currentType.value == "password"){
                    currentType.value = 'text'
                }else currentType.value = 'password';
            }

            const formatEmail = (email)=>{
                if(email.length >= 15){
                    return email.slice(0,15).concat('...')
                }else return email
            }
            const formatPhone = (phone)=>{
                if(isNaN(phone)) return null;
                else return phone;
            }
            return{currentType,toggleVisible,formatEmail,formatPhone}
        }    
    }
</script>

<style lang="scss" scoped>
.info-box{
    position: relative;
}
.card{
    min-width: 16rem;
    min-height: 5rem;
    padding: 1.2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 1.2rem;
}
.nickname{
    padding: 0.3rem 1.5rem;
    border-radius: 10rem;
    background-color: $color-orange;
    color: white;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
}
.fullname{
    font-family: "Averta Bold";
    margin-bottom: 0.8rem;
}
.info{
    width: 100%;
    display: flex;
}
.title{
    flex-basis: 1;
    width: 3rem;
    margin-right: 0.5rem;
    color: $color-orange;
}
.content{
    flex-basis: 4;
    color: $color-gray-dark;
}
</style>