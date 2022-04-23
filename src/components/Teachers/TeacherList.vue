<template>
    <div class="teachers-list">
        <ul class="collapsible">
            <li v-for="ad in admins" :key="ad.id">
                <div :class="[{'red-border' : ad.role == 'Teacher'},'collapsible-header teacher-header']">
                    <div class="teacher-ava">
                        <Image class="teacher-img" :refUrl="ad.avaRef"/>
                    </div>
                    <div class="teacher-title">
                        <h5 class="teacher-name">{{ad.name}}</h5>
                        <p class="teacher-role">{{ad.role}}</p>
                    </div>
                    <div v-if="isExactUser(ad.id)" class="teacher-button" @click="$emit('update',ad.id)">
                        <i class="material-icons">edit</i>
                    </div>
                </div>
                <div class="collapsible-body">
                    <div class="teacher-body">
                        <div class="teacher-content">
                            <div class="teacher-nickname">Nickname: {{ad.nickname}}</div>
                            <div class="teacher-email">Email: {{ad.email}}</div>
                            <div class="teacher-phone">Phone Number: {{ad.phone}}</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {onMounted} from 'vue'
    
    export default {
        props: ['admins','currentID','isAdmin'],
        setup(props) {
            onMounted(() => {
                $(document).ready(function(){
                    $('.collapsible').collapsible();
                });
            });
            
            const isExactUser = (id)=> {
                if(props.currentID == id || props.isAdmin) return true;
                else return false; 
            }
            return {isExactUser}
        }
    }
</script>

<style lang="scss" scoped>
   //TEACHER LIST
    .teachers-list{
        width: 90%;
    }
    .teacher-header{
        display: flex;
        position: relative;
        border-left: 4px solid $color-orange;
        &.red-border{
            border-left: 4px solid $color-primary;
        }
    }
    .teacher-ava{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
        overflow: hidden;
        position: relative;
    }
    .teacher-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 100%;
    }
    .teacher-role{
        color: $color-gray-dark;
    }
    .teacher-button{
        position: absolute;
        right: 0%;
        top: 50%;
        transform: translate(-50%,-50%);
        transition: all 0.2s;
        color: black;
        &:hover{
            transform: translate(-50%,-50%) scale(1.2);
            color: $color-primary;
        }
    }

    .teacher-body{
        display: flex;
        justify-content: space-between;

    }
    .teacher-remove button{
        border-radius: 20px;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
    }
</style>