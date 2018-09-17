<template lang="pug">
v-card
    v-toolbar(color="primary", dense)
        v-toolbar-title {{ title }}
        v-spacer
        v-toolbar-items
            v-btn(small, icon, v-if="confidential === true", @click="show_content = !show_content")
                v-icon remove_red_eye
            v-btn(small, icon, :to="{name: 'edit-note', params: {id: id}}")
                v-icon edit
    v-card-text
        pre(v-if="confidential !== true || show_content") {{ content }}
        i(v-else) [{{ $t('confidential') }}]
</template>

<script>
export default {
    name: 'note-display',
    props: ['id', 'title', 'content', 'confidential'],
    data() {
        return {
            show_content: false,
        };
    },
};
</script>

