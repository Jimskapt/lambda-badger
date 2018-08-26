<template lang="pug">
    v-container
        h2
            span(v-if="exists") Edit 
            span(v-else) Create 
            | note 
            span(v-if="exists") \#{{ dbDoc._id }}
        pre {{dbDoc}}
        v-textarea(:label="$t('Content')", v-model="dbDoc.content")
        v-btn(block, color="primary", @click="save", v-if="exists")
            v-icon save
            span {{ $t("Save") }}
        v-btn(block, color="primary", @click="save", v-else)
            v-icon add
            span {{ $t("Create") }}
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { NoteDoc } from '@/custom-types.d.ts';

@Component
export default class SettingsPage extends Vue {
    @Prop(String) public id!: string;
    public dbDoc: NoteDoc = {
        content: '',
        data_type: 'note',
    };

    get exists() {
        return typeof(this.dbDoc._rev) !== 'undefined';
    }

    public save() {
        this.$store.dispatch('setNote', {data: this.dbDoc})
            .then((res) => {
                if (res.ok) {
                    if (typeof(res.doc) !== 'undefined') {
                        Vue.set(this, 'dbDoc', res.doc);
                    } else {
                        console.error('CPE0003', res);
                    }
                } else {
                    console.error('CPE0001:', res);
                    // TODO
                }
            })
            .catch((err) => { console.error('CPE0002:', err); }); // TODO
    }

    @Watch('id')
    public id_changed(value: string) {
        this.$store.dispatch('getNote', {id: value})
            .then((res) => {
                if (res.find) {
                    Vue.set(this, 'dbDoc', res.doc);
                } else {
                    Vue.set(this, 'dbDoc', {
                        content: '',
                        data_type: 'note',
                    });
                }
            })
            .catch((err) => {
                // no problem if error
                Vue.set(this, 'dbDoc', {
                    content: '',
                    data_type: 'note',
                });
            });
    }

    public created() {
        this.id_changed(this.id);
    }
}
</script>
