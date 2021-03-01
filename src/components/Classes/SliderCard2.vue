<template>
    <div class="slider-card">
        <div class="button-wrapper" v-if="classes">
                <!-- PREV BUTTON -->
                <a
                    href="#"
                    class="button button-prev"
                    @click="sliderChange('prev')"
                >
                    <i class="material-icons">arrow_back</i>
                </a>

                <!-- NEXT BUTTON -->
                <a
                    href="#"
                    class="button button-next"
                    @click="sliderChange('next')"
                >
                    <i class="material-icons">arrow_forward</i>
                </a>
        </div>
        <div class="container-wrapper" :style="containerWrapper">
            <div class="container-overflow" :style="containerOverflow">
                <div 
                    v-if="classes" 
                    v-for="(classi,index) in filterClasses" :key="classi.id"
                    :style="card" :id="classi.id" 
                    @click="$emit('activateClass',index)"
                    :class="[{active : index == activeClass},'card-class']" 
                >
                    <!-- card class bây h chỉ nhận nhiệm vụ hiển thị từ id thôi -->
                    <CardClass2 :classi="classi" :type="activeCourse"/>
                </div>
                <div 
                    v-else   
                    v-for="index in cardCount" :key="index"
                    :style="card"
                >
                    <div class="cards skeleton"></div>
                </div>
            </div>
        </div>
       <div class="pagination">
           <span v-for="index in maxPage+1" :key="index" :class="[{active: index-1 == pagination },'dot']"></span>
       </div>
    </div>

</template>

<script>
    import {computed, ref, watch, watchEffect} from 'vue'
    import getCollectionRT from '@/composable/getCollectionRT'
    import CardClass2 from '@/components/Classes/CardClass2'
    import {projectFirestore} from '@/firebase/config'
    export default {
        components:{
            CardClass2
        },
        props: ['cardWidth','cardHeight', 'cardSpace', 'cardCount','activeCourse', 'activeClass','activeClassID'],
        setup(props) {
    //STYLING DOM (ta chỉ quy định chiều dài + rộng + giãn cách của card thôi)

                //Wrapper là cái bọc che, overflow là cho dài ra hẳn
                const pagination = ref(0);
                const maxPage = ref(0);

                const startMargin = ref(15)  // ta mở rộng wrapper và thụt lùi overflow vào để ko bị cắt mất viền active
                const wrapperWidth = ref(startMargin.value + props.cardWidth * props.cardCount + props.cardSpace*(props.cardCount -1));
                const overflowWidth = ref(props.cardWidth*10 + props.cardSpace*9)

            /////////////////////////////////////////////////////////////////////////////////////////////////////

                const containerWrapper = ref(`width : ${wrapperWidth.value}px; 
                                                height: ${props.cardHeight +20}px`);
                const containerOverflow = ref('');
                // mỗi khi pagination thay đổi thì chạy lại hàm này watch để cập nhật lại translate
                watchEffect(()=>{
                    if(pagination.value == 0){
                        containerOverflow.value = `width : ${overflowWidth.value}px; transform: translateX(0px)`;
                    }else{
                        containerOverflow.value = `width : ${overflowWidth.value}px; 
                                                    transform: translateX(-${pagination.value * (wrapperWidth.value)+ startMargin.value}px)`
                    }
                })

                const card = ref(`width: ${props.cardWidth}px;
                                    height: ${props.cardHeight}px; 
                                    margin-right: ${props.cardSpace}px`);

            /////////////////////////////////////////////////////////////////////////////////////////////////////
                
                const sliderChange = (change) => {
                    if(pagination.value < maxPage.value && change == 'next'){
                        pagination.value++;
                    }else if(pagination.value > 0 && change == 'prev'){
                        pagination.value--;
                    }else{
                        pagination.value = 0;
                    }
                }


    // DATA

                //Load list tất cả các class tồn tại nhưng mà đc gán với onSnapshot ==> phải watch sự thay đổi của nó

                const {documents : classes,error} = getCollectionRT("classes");
                watchEffect(()=>{
                    if(classes.value != null){
                        maxPage.value = parseInt((classes.value.length) / props.cardCount);
                    }
                })


                //activeCourse đang chọn là animation => lọc ra class có type animation
                const filterClasses = computed(()=>{
                    return classes.value.filter((classi) => {
                            if(props.activeCourse === classi.type){
                                return classi;
                            }
                    })

                })
            
            
            //FUNCTION DICH CHUYỂN SLIDER: DỊCH containerOverflow
            // Click vào card thì update lại activeClass ==> ta watch cái biến này để dịch chuyển container, thay vì chạy event thay đổi trực tiếp transform luôn

            return{
                containerWrapper,containerOverflow,card,
                sliderChange,pagination,wrapperWidth,startMargin,maxPage,
                classes,filterClasses,
                
            }

        }
    }
</script>

<style lang="scss" scoped>
.slider-card{
    position: relative;
}

/// BUTTON
.button-wrapper {
    position: absolute;
    width: 104%;
    height: 100%;
    top: 0%;
    left: -1.3%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.button {
    z-index: 3;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: rgba($color-gray-dark, 0.5);
    color: $color-white;
    @include nav-drop;

    &-next {
        top: 40%;
        right: -1rem;
    }
    &-prev {
        top: 40%;
        left: -1rem;
    }
}


/// SLIDER
.container-wrapper{
    overflow: hidden;
    display: flex;
    align-items: center;

}
.container-overflow{
    display: flex;
    margin-left: 15px;
    transition: transform  0.6s cubic-bezier(.72,-0.47,.38,1.34);
    & >*{
        //overide materialize
        margin-top: 0;
        margin-bottom: 0;
    }
}

.cards.skeleton{
    width: 100%;
    height: 100%;
    border-radius: 15px;
    background-color: $color-gray-light-1;
    animation: pulse 1s ease-in-out infinite;
    // @include card-shadow-2;
}
.card-class{
    cursor: pointer;
    position: relative;
}
.card-class.active{
    &::after{
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 103%;
        height: 106%;
        border-radius: 18px;
        z-index: -1;
        background-color: $color-primary;

    }
    
}

///////// PAGINATION ///////////

.pagination{
    display: flex;
    justify-content: center;
    align-items: center;
}
.dot{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: $color-gray-light-1;
    margin: 5px 5px;
    transition: all 0.2s ease;
}
.dot.active{
    background-color: $color-primary;
}



</style>

/*
DOC hướng dẫn cho Slider
            1. Fetch và xử lý classes
- Component SLider này fetch lấy tất cả các doc trong collection("classes") lưu vào biến classes. Biến ấy tuy nhiên chưa dùng được ngay mà phải lọc (filter) ra biến computed là filterClasses (lọc lấy phần tử nào có type trùng với prop activeCourse---biến này được thay đổi bởi ClassNav.vue khi click vào các tab) 
==> mỗi lần click vào tab, ta sẽ đổi đc filterClasses

            2. v-for cái array đc lọc
- filterClasses được cycle throught để tạo ra các "bọc div" có class là card-class, và sẽ nhận thêm active khi index của nó trùng với prop activeClass--được truyền trực tiếp từ trang chủ classManage, biến activeClass này được update khi ta click vào chính cái "bọc div" ấy
==> click vào bọc của card là ta nhảy class active về card đó

            3. Style bằng inline HTML
- truyền vào Slider này là width, height, space và count để quyết định kích thước của card, số lượng card tối đa, kích thước của cái overflow và wrapper 

            4. Truyền từ bọc card vào components <CardClass/> ở bên trong
-   CardComponent nhận mỗi data về 1 class(lớp học) để hiển thị các thông tin cơ bản, truyền thêm cả activeCourse hiện tại tab đang bật để quyết định backgound là hình ae hay ai

            5.Thêm loading skeleton
- filterClasess còn dùng cho v-if, để khi mà chưa fetch đc classes, chưa có filterClasses, thì nó sẽ dùng "cards skeleton" để thay thế và loading


 */