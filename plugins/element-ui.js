import Vue from 'vue'
import { Alert, Button, Card, Collapse, CollapseItem, Menu, MenuItem, MenuItemGroup, Option, RadioButton, RadioGroup, Select, Submenu } from 'element-ui'
import nl from 'element-ui/lib/locale/lang/nl'
import locale from 'element-ui/lib/locale'

export default () => {
    locale.use(nl)
    Vue.use(Alert)
    Vue.use(Button)
    Vue.use(Card)
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Menu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Option);
    Vue.use(RadioButton);
    Vue.use(RadioGroup);
    Vue.use(Select);
    Vue.use(Submenu);
}
