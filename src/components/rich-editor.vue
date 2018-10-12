<template lang="pug">
div
    v-container(class="toolbar", class="mb-2")
        v-btn-toggle(v-model="tool", multiple, color="primary")
            v-btn(@click="addTag('**','**')")
                v-icon format_bold
            v-btn(@click="addTag('*','*')")
                v-icon format_italic
            v-btn(@click="addTag('\\n# ','\\n')")
                v-icon title
    div(class="content")
        v-tabs(model="tabs", centered, grow, color="primary")
            v-tab
                v-icon edit
                span &nbsp;{{ $t('Rich text') }}
            v-tab-item
                pre(ref="render", contenteditable="true", v-html="htmlContent")
            v-tab
                v-icon code
                span &nbsp;{{ $t('Markdown code') }}
            v-tab-item
                v-textarea(:label="label", v-model="markdownContent", @input="change")
</template>

<script>
function parser(input) {
    let result = '';

    if(input.trim() !== '') {
        let firstRule = {};

        const markdownRules = [
            {
                tag: 'strong',
                regex: /\*\*([^(**)]+)\*\*/gm,
                outter_index: 0,
                inner_index: 1,
                shift_left: [],
            },
            {
                tag: 'em',
                regex: /(^|[^*])(\*([^*]+)\*)([^*]|$)/gm,
                outter_index: 2,
                inner_index: 3,
                shift_left: [1],
            },
            {
                tag: 'h1',
                regex: /^# ([^\n]+)\n/gm,
                outter_index: 0,
                inner_index: 1,
                shift_left: [],
            },
        ];

        markdownRules.forEach((rule) => {
            const test = rule.regex.exec(input);
            if(test !== null) {
                let start_index = test.index;
                rule.shift_left.forEach((i) => {
                    start_index += test[i].length;
                });

                if(start_index < firstRule.position || typeof(firstRule.position) === 'undefined') {
                    firstRule = {
                        position: start_index,
                        rule: rule,
                        test: test,
                    };
                }
            }
        });

        if(typeof(firstRule.position) !== 'undefined' && typeof(firstRule.rule) !== 'undefined' && typeof(firstRule.test) !== 'undefined') {
            const before = input.substring(0, firstRule.position);
            result += '<span md-content="' + before + '">' + before + '</span>';

            if(typeof(firstRule.rule.formatter) === 'function') {
                result += firstRule.rule.formatter(firstRule.test[firstRule.rule.inner_index]);
            } else {
                result += '<' + firstRule.rule.tag;
                if(typeof(firstRule.rule.tag_arguments) !== 'undefined') {
                    result += ' ' + firstRule.rule.tag_arguments;
                }
                result += ' md-content="' + firstRule.test[firstRule.rule.outter_index] + '"'
                result += '>' + parser(firstRule.test[firstRule.rule.inner_index]) + '</' + firstRule.rule.tag + '>';
            }
            result += parser(input.substring(firstRule.position + firstRule.test[firstRule.rule.outter_index].length));
        } else {
            result += '<span md-content="' + input + '">' + input + '</span>';
        }
    }

    return result;
}

export default {
    name: 'rich-editor',
    props: ['value','label'],
    data() {
        return {
            tool: [],
            tabs: null,
            markdownContent: '',
        };
    },
    computed: {
        htmlContent() {
            return parser(this.markdownContent);
        },
    },
    watch: {
        value(val) {
            this.markdownContent = val;
        },
    },
    methods: {
        change(val) {
            this.$emit('input', val);
        },
        addTag(openTag, closeTag) {
            const selection = window.getSelection();

            let newContent = '';
            if(selection.anchorOffset === 0 && selection.focusOffset === 0) {
                newContent += this.markdownContent + ' ';
                newContent += openTag;
                newContent += 'text';
                newContent += closeTag;
            } else {
                for (let i_childNodes = 0; i_childNodes < this.$refs.render.childNodes.length; i_childNodes++) {
                    const child = this.$refs.render.childNodes[i_childNodes];

                    for (let i_attr = 0; i_attr < child.attributes.length; i_attr++) {
                        const attr = child.attributes[i_attr];
                        if(selection.anchorNode.parentNode == child) {
                            newContent += attr.value.substring(0, selection.anchorOffset);
                            newContent += openTag;
                            newContent += attr.value.substring(selection.anchorOffset, selection.focusOffset);
                            newContent += closeTag;
                            newContent += attr.value.substring(selection.focusOffset);
                        } else {
                            newContent += attr.value;
                        }
                    }
                }
            }

            this.markdownContent = newContent;
        }
    },
};
</script>
