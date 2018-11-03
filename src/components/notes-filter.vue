<template lang="pug">
div
    v-autocomplete(
        v-model="filters.subjects",
        :items="availableSubjects",
        :label="$t('Filter')",
        class="mx-1",
        prepend-inner-icon="filter_list",
        flat, multiple, dense, chips,
        deletable-chips, small-chips,
        clearable, solo, hide-no-data,
        hide-details)
    div(class="mx-1")
        v-checkbox(
            :label="$t('Display archives')",
            v-model="filters.show_archives")
</template>

<script>
export default {
    name: 'notes-filter',
    prop: ['value'],
    data() {
        return {
            filters: {
                subjects: [],
                show_archives: false,
            },
        };
    },
    watch: {
        filters: {
            handler(val) {
                this.$emit('input', val);
            },
            deep: true,
        },
    },
    computed: {
        availableSubjects() {
            let result = ['*' + this.$t('no subject') + '*'];

            result = result.concat(Object.keys(this.$store.state.subjects));

            return result;
        },
    },
    created() {
        // this.$emit('input', this.filters);
    }
};
</script>
