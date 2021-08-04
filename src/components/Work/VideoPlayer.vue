<template>
    <teleport to="#modal">
        <transition name="fadeModal" appear>
            <div
                v-if="showModal"
                class="modal-back"
                @click="closeCreateModal"
            ></div>
        </transition>

        <transition name="slideModal" appear>
                <iframe
                    v-if="showModal"
                    class="player"
                    :src="url"
                    width="1280"
                    height="720"
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowfullscreen
                    frameborder="0"
                    scrolling="no"
                ></iframe> 
        </transition>
    </teleport>
</template>

<script>
    import qs from 'qs'
    import {computed,watchEffect} from 'vue'
    export default {
        emits: ['closeModal'],
        props:['showModal','work'],
        setup(props,context) {
            const closeCreateModal = ()=>{
                    context.emit('closeModal',false);
            }   
            //generate URL of for iframe player
            const url = computed(()=>{
                const config = {
                    cloud_name: "umaster",
                    public_id: props.work.publicId,
                    player:{
                        fluid: true,
                        controls: true,
                        muted: false,
                        font_face: "Fugaz One",
                        skin: "light",
                        colors: {
                            accent: "#aa0f1e"
                        },
                        logo_onclick_url: "https://umaster-resourse-page.web.app/",
                        logo_image_url: "https://res.cloudinary.com/umaster/image/upload/v1627718443/StudentWorks/logo_UM-size_b%C3%A9_hqk6wg.png",
                        floating_when_not_visible:"right",
                        show_jump_controls: true,
                        autoplay: true,
                        loop: true,
                        playback_rates: [0.1,0.25,0.5,0.75,1],
                        source: {
                            public_id: props.work.publicId,
                            info: {
                                autoplay_on_scroll: false,
                                title: props.work.workName,
                            },
                            source_types: ['mp4','mov']
                        }
                    }
                }
                const params = qs.stringify(config);
                return "https://player.cloudinary.com/embed/?"+ params;    
            })



            return {closeCreateModal,url}
        }
    }
</script>

<style lang="scss" scoped>
//////////////////BACK GROUND/////////////////
.modal-back {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.6);
}
.fadeModal-enter-from,
.fadeModal-leave-to {
    opacity: 0;
}

.fadeModal-enter-active,
.fadeModal-leave-active {
    transition: opacity 0.5s;
}

///////////// PLAYERR/////////////

.player{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
}

.slideModal-enter-from,
.slideModal-leave-to {
    transform: translateY(-50%) translateX(100vw);
}

.slideModal-enter-active,
.slideModal-leave-active {
    transition: transform 0.5s;

}

</style>