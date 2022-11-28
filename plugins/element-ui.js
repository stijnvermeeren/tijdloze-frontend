import Vue from 'vue'
import { Alert, Collapse, CollapseItem, Option, RadioButton, RadioGroup, Select } from 'element-ui'
import nl from 'element-ui/lib/locale/lang/nl'
import locale from 'element-ui/lib/locale'

export default () => {
    locale.use(nl)
    Vue.use(Alert)
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Option);
    Vue.use(RadioButton);
    Vue.use(RadioGroup);
    Vue.use(Select);
}
