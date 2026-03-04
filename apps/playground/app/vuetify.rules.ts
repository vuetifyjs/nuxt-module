export default {
  required: (v: any) => !!v || 'Field is required (custom)',
}
