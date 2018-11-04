<template lang="pug">
div
    div(class="content")
        v-textarea(:label="label", v-model="markdownContent", @input="change", auto-grow)
        v-expansion-panel
            v-expansion-panel-content
                p(slot="header")
                    v-icon visibility
                    |  {{ $t('Preview') }}
                div(v-html="htmlContent")
</template>

<script>
import markdownIt from 'markdown-it';
import markdownItCheckboxes from 'markdown-it-checkbox';

const markdownConverter = markdownIt().use(markdownItCheckboxes);

export default {
    name: 'rich-editor',
    props: ['value','label'],
    data() {
        return {
            markdownContent: '',
        };
    },
    watch: {
        value(val) {
            this.markdownContent = val;
        },
    },
    computed: {
        htmlContent() {
            return markdownConverter.render(this.markdownContent);
        },
    },
    methods: {
        change(val) {
            this.$emit('input', val);
        },
    },
};
</script>
