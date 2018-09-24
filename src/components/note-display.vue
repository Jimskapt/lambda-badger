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
        pre(v-if="confidential !== true || show_content", style="overflow:auto;") {{ content }}
        i(v-else) [{{ $t('confidential') }}]
        div(v-if="subjects !== undefined", class="text-xs-right")
            v-divider(style="margin: 0.5em 0px;")
            template(v-for="subject in subjects")
                v-chip(small, outline) {{ subject }}
</template>

<script>
export default {
    name: 'note-display',
    props: ['id', 'title', 'content', 'confidential', 'subjects'],
    data() {
        return {
            show_content: false,
        };
    },
};
</script>

