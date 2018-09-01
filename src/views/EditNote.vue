<template lang="pug">
    v-container
        v-container
            v-btn(color="secondary", @click="$router.back()")
                v-icon chevron_left
                span {{ $t('Go back') }}
        h2
            span(v-if="exists") Edit 
            span(v-else) Create 
            | note 
            span(v-if="exists") \#{{ dbDoc._id }}
        v-textarea(:label="$t('Content')", v-model="dbDoc.content")
        v-btn(block, color="primary", @click="save", v-if="exists")
            v-icon save
            span {{ $t("Save") }}
        v-btn(block, color="primary", @click="save", v-else)
            v-icon add
            span {{ $t("Create") }}
</template>

<script>
export default {
    name: 'edit-note',
    props: ['id'],
    data() {
        return {
            dbDoc: {
                content: '',
                data_type: 'note'
            }
        }
    },
    computed: {
        exists () {
            return typeof(this.dbDoc._rev) !== 'undefined'
        }
    },
    methods: {
        id_changed(value) {
            const that = this;
            this.$store.dispatch('getNote', {id: value})
                .then((res) => {
                    if (res.find) {
                        that.$set(this, 'dbDoc', res.doc);
                    } else {
                        that.$set(this, 'dbDoc', {
                            content: '',
                            data_type: 'note',
                        });
                    }
                })
                .catch(() => {
                    // no problem if error
                    that.$set(this, 'dbDoc', {
                        content: '',
                        data_type: 'note',
                    });
                });
        },
        save() {
            const that = this;
            this.$store.dispatch('setNote', {data: this.dbDoc})
                .then((res) => {
                    if (res.ok) {
                        if (typeof(res.doc) !== 'undefined') {
                            that.$set(this, 'dbDoc', res.doc)
                        } else {
                            console.error('CPE0003', res)
                        }
                    } else {
                        console.error('CPE0001:', res)
                        // TODO
                    }
                })
                .catch((err) => { console.error('CPE0002:', err) }) // TODO
        }
    },
    created() {
        this.id_changed(this.id);

        const that = this;
        this.$store.dispatch('getNote', {id: this.id})
            .then((res) => {
                if (res.find) {
                    that.$set(this, 'dbDoc', res.doc)
                } else {
                    that.$set(this, 'dbDoc', {
                        content: '',
                        data_type: 'note',
                    })
                }
            })
            .catch(() => {
                // no problem if error
                that.$set(this, 'dbDoc', {
                    content: '',
                    data_type: 'note',
                })
            })
        
        this.$store.watch(
            function() { return that.id },
            function(value) { that.id_changed(value) }
        );
    }
}
</script>
