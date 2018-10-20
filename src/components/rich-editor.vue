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
            v-btn(@click="addTag('~~','~~')")
                v-icon strikethrough_s
            v-btn(@click="addTag('\\n- ','\\n')")
                v-icon format_list_bulleted
            v-btn(@click="addTag('\\n\\n1. ','\\n\\n')")
                v-icon format_list_numbered
            v-btn(@click="addTag('[x] ','\\n')")
                v-icon check_box
            v-btn(@click="addTag('[ ] ','\\n')")
                v-icon check_box_outline_blank
    div(class="content")
        v-tabs(v-model="tabs", centered, grow, color="primary")
            v-tab
                v-icon edit
                span &nbsp;{{ $t('Rich text') }}
            v-tab-item
                pre(ref="render", contenteditable="true", @input="rebuildMarkdownFromHTML")
            v-tab
                v-icon code
                span &nbsp;{{ $t('Markdown code') }}
            v-tab-item
                v-textarea(:label="label", v-model="markdownContent", @input="change")
</template>

<script>
function parser(input) {
    let result = document.createDocumentFragment();

    if(input.trim() !== '') {
        let firstRule = {};

        const markdownRules = [
            {
                tag: 'strong',
                regex: /((\*\*)|(__))(.+)((\*\*)|(__))/gms,
                outter_index: 0,
                inner_index: 4,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'em',
                regex: /(^|[^*])((\*)([^*]+)\*)([^*]|$)/gms,
                outter_index: 2,
                inner_index: 4,
                start_tag_index: 3,
                shift_left: [1],
            },
            {
                tag: 'em',
                regex: /(_)(.+)_/gms,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'del',
                regex: /(~~)(.+)~~/gms,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h1',
                regex: /^(# )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h2',
                regex: /^(## )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h3',
                regex: /^(### )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h4',
                regex: /^(#### )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h5',
                regex: /^(##### )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'h6',
                regex: /^(###### )(.+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'ul',
                regex: /(\n)((- ?(.+)\n)+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                shift_left: [],
            },
            {
                tag: 'ol',
                regex: /(\n)(([0-9]+\. ?(.+)\n)+)\n/gm,
                outter_index: 0,
                inner_index: 2,
                shift_left: [],
            },
            {
                tag: 'li',
                regex: /^((-|([0-9]+\.)) ?)(.+)$/gm,
                outter_index: 0,
                inner_index: 4,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                tag: 'code',
                regex: /(`)(.+)`/gm,
                outter_index: 0,
                inner_index: 2,
                start_tag_index: 1,
                shift_left: [],
            },
            {
                formatter: function(inner, outter) {
                    const label = document.createElement('label');
                    label.setAttribute('md-outter', outter);
                    label.setAttribute('md-start-tag', '[ ] ');

                    const input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('disabled', true);

                    label.appendChild( input );
                    label.appendChild( parser(inner) );

                    return label;
                },
                regex: /\[ \] ([^\n]+)(\n|$)/gm,
                outter_index: 0,
                inner_index: 1,
                shift_left: [],
            },
            {
                formatter: function(inner, outter) {
                    const label = document.createElement('label');
                    label.setAttribute('md-outter', outter);
                    label.setAttribute('md-start-tag', '[x] ');

                    const input = document.createElement('input');
                    input.setAttribute('type', 'checkbox');
                    input.setAttribute('disabled', true);
                    input.setAttribute('checked', true);

                    const del = document.createElement('del');
                    del.appendChild( parser(inner) );

                    label.appendChild( input );
                    label.appendChild( del );

                    return label;
                },
                regex: /\[x\] ([^\n]+)(\n|$)/gm,
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
            if(before !== '') {
                result.appendChild( document.createTextNode(before) );
            }

            if(typeof(firstRule.rule.formatter) === 'function') {
                if(typeof(firstRule.rule.inner_index) !== 'undefined') {
                    result.appendChild( firstRule.rule.formatter(firstRule.test[firstRule.rule.inner_index], firstRule.test[firstRule.rule.outter_index]) );
                }
            } else {
                var el = document.createElement(firstRule.rule.tag);

                el.setAttribute('md-outter', firstRule.test[firstRule.rule.outter_index]);
                if(typeof(firstRule.rule.start_tag_index) !== 'undefined') {
                    el.setAttribute('md-start-tag', firstRule.test[firstRule.rule.start_tag_index]);
                }
                if(typeof(firstRule.rule.inner_index) !== 'undefined') {
                    el.appendChild( parser(firstRule.test[firstRule.rule.inner_index]) );
                }

                result.appendChild( el );
            }

            result.appendChild( parser(input.substring(firstRule.position + firstRule.test[firstRule.rule.outter_index].length)) );
        } else {
            result.appendChild( document.createTextNode(input) );
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
            tabs: 1,
            markdownContent: '',
        };
    },
    watch: {
        value(val) {
            this.markdownContent = val;
        },
        markdownContent(val) {
            while(this.$refs.render.firstChild) {
                this.$refs.render.removeChild(this.$refs.render.firstChild);
            }

            this.$refs.render.appendChild( parser(val) );
        },
    },
    methods: {
        change(val) {
            this.$emit('input', val);
        },
        rebuildMarkdownFromHTML() {
            let newContent = '';
            for (let i_childNodes = 0; i_childNodes < this.$refs.render.childNodes.length; i_childNodes++) {
                const child = this.$refs.render.childNodes[i_childNodes];

                let mdValue = '';

                if(typeof(child.attributes) !== 'undefined') {
                    for (let i_attr = 0; i_attr < child.attributes.length; i_attr++) {
                        const attr = child.attributes[i_attr];
                        if(attr.name === 'md-outter') {
                            mdValue = attr.value;
                        }
                    }
                } else {
                    mdValue = child.wholeText;
                }

                newContent += mdValue;
            }

            this.markdownContent = newContent;

            this.change(newContent);
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
                    let startTag = '';

                    if(typeof(child.attributes) !== 'undefined') {
                        for (let i_attr = 0; i_attr < child.attributes.length; i_attr++) {
                            const attr = child.attributes[i_attr];
                            if(attr.name === 'md-outter') {
                                mdValue = attr.value;
                            } else if(attr.name === 'md-start-tag') {
                                startTag = attr.value;
                            }
                        }
                    } else {
                        mdValue = child.wholeText;
                    }

                    if(startNode == endNode) {
                        if(startNode.parentNode == child || startNode == child) {
                            newContent += mdValue.substring(0, startSelection + startTag.length);
                            newContent += openTag;
                            newContent += mdValue.substring(startSelection + startTag.length, endSelection + startTag.length);
                            newContent += closeTag;
                            newContent += mdValue.substring(endSelection + startTag.length);
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

            this.change(newContent);
        }
    },
};
</script>
