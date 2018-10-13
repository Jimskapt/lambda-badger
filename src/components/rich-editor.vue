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
                regex: /\*\*(.+)\*\*/gms,
                outter_index: 0,
                inner_index: 1,
                shift_left: [],
            },
            {
                tag: 'em',
                regex: /(^|[^*])(\*(.+)\*)([^*]|$)/gms,
                outter_index: 2,
                inner_index: 3,
                shift_left: [1],
            },
            {
                tag: 'h1',
                regex: /^# (.+)\n/gm,
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
            // result += '<span md-outter="' + before + '">' + before + '</span>';
            result += before;

            if(typeof(firstRule.rule.formatter) === 'function') {
                result += firstRule.rule.formatter(firstRule.test[firstRule.rule.inner_index]);
            } else {
                result += '<' + firstRule.rule.tag;
                if(typeof(firstRule.rule.tag_arguments) !== 'undefined') {
                    result += ' ' + firstRule.rule.tag_arguments;
                }
                result += ' md-outter="' + firstRule.test[firstRule.rule.outter_index] + '"'
                result += '>' + parser(firstRule.test[firstRule.rule.inner_index]) + '</' + firstRule.rule.tag + '>';
            }
            result += parser(input.substring(firstRule.position + firstRule.test[firstRule.rule.outter_index].length));
        } else {
            // result += '<span md-outter="' + input + '">' + input + '</span>';
            result += input;
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

            let startSelection = selection.anchorOffset;
            let startNode = selection.anchorNode;

            let endSelection = selection.focusOffset;
            let endNode = selection.focusNode;

            if(startSelection > endSelection && startNode == endNode) {
                const temp = startSelection;
                const tempNode = startNode;

                startSelection = endSelection;
                startNode = endNode;

                endSelection = temp;
                endNode = tempNode;
            }

/*
            console.log(startSelection,':',startNode);
            console.log(endSelection,':',endNode);
*/

            let newContent = '';
            if(startSelection === 0 && endSelection === 0) {
                newContent += this.markdownContent + ' ';
                newContent += openTag;
                newContent += 'text';
                newContent += closeTag;
            } else {
                for (let i_childNodes = 0; i_childNodes < this.$refs.render.childNodes.length; i_childNodes++) {
                    const child = this.$refs.render.childNodes[i_childNodes];

                    let mdValue = '';

                    if(typeof(child.attributes) !== 'undefined') {
                        for (let i_attr = 0; i_attr < child.attributes.length; i_attr++) {
                            const attr = child.attributes[i_attr];
                            if(attr.name === 'md-outter') {
                                mdValue = attr.value;
                                break;
                            }
                        }
                    } else {
                        mdValue = child.wholeText;
                    }

                    if(startNode == endNode) {
                        if(startNode.parentNode == child || startNode == child) {
                            newContent += mdValue.substring(0, startSelection);
                            newContent += openTag;
                            newContent += mdValue.substring(startSelection, endSelection);
                            newContent += closeTag;
                            newContent += mdValue.substring(endSelection);
                        } else {
                            newContent += mdValue;
                        }
                    } else {
                        let isTag = false;

                        if(startNode.parentNode == child || startNode == child) {
                            newContent += mdValue.substring(0, startSelection);
                            newContent += openTag;
                            newContent += mdValue.substring(startSelection);

                            isTag = true;
                        }

                        if(endNode.parentNode == child || endNode == child) {
                            newContent += mdValue.substring(0, endSelection);
                            newContent += closeTag;
                            newContent += mdValue.substring(endSelection);
                            
                            isTag = true;
                        }

                        if(!isTag) {
                            newContent += mdValue;
                        }
                    }
                }
            }

            this.markdownContent = newContent;
        }
    },
};
</script>
