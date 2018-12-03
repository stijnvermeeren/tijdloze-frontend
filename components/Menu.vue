<template>
  <div>
    <div id="sideNav" :class="{closed: !isOpen}">
      <nav>
        <div id="menu">
          <ul>
            <li><nuxt-link to="/">Home</nuxt-link></li>
            <li><nuxt-link to="/lijsten">De Tijdloze van...</nuxt-link>
              <ul>
                <template v-for="(year, index) in years">
                  <li v-if="years.length - index < 3 || allLists" :key="year.yyyy">
                    <nuxt-link :to="'/lijst/' + year.yyyy">{{year.yyyy}}</nuxt-link>
                  </li>
                </template>
                <li v-if="!allLists"><a @click="allLists = true">Meer tonen</a></li>
                <li v-else><a @click="allLists = false">Minder tonen</a></li>
              </ul>
            </li>
            <li><nuxt-link to="/artiesten">Artiesten en nummers</nuxt-link></li>
            <li><nuxt-link to="/tijdlozetijdloze">De Tijdloze Tijdloze</nuxt-link></li>
            <li><nuxt-link to="/statistieken">Statistieken</nuxt-link></li>
            <li><nuxt-link to="/website">Over deze website</nuxt-link></li>
          </ul>
        </div>
        <tijdloze-search-box></tijdloze-search-box>
        <tijdloze-login></tijdloze-login>

        <span class="cross-button" @click="isOpen = false">
          <span class="cross" style="transform: rotate(45deg)" />
          <span class="cross" style="transform: rotate(-45deg)" />
        </span>
      </nav>
    </div>

    <div class="burger-button" @click="isOpen = true">
      <span class="burger-bars" :style="{top:20 * (index * 2) + '%'}" v-for="(x, index) in 3" :key="index"></span>
    </div>

  </div>
</template>

<script>
  import Login from '../components/Login'
  import SearchBox from '../components/SearchBox'

  export default {
    components: {
      tijdlozeLogin: Login,
      tijdlozeSearchBox: SearchBox
    },
    data() {
      return {
        allLists: false,
        isOpen: false
      };
    },
    computed: {
      years() {
        return this.$store.getters.years;
      }
    },
    watch: {
      '$route': function() {
        this.isOpen = false;
      }
    }
  };
</script>


<style lang="less" scoped>
  @import "../assets/globalStyles.less";


  #sideNav {
    box-sizing: border-box;
    height: 100%;
    width: 300px;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: @menuBackgroundColor;
    overflow-x: hidden;
    padding: 1em 2em;
    transition: 0.5s;

    font-size: 115%;
    text-align: right;

    @media (min-width: 1200px) {
      height: 100%;
      min-height: 800px;
      top: 90px;
      position: absolute;
    }


    @media (max-width: 1199px) {
      padding-top: 70px;

      &.closed {
        left: -300px;
      }
    }
  }

  #menu {
    ul {
      .noBullets;
      margin: 0 0 2em;

      li {
        padding: 0.5em 0;
        font-weight: bold;

        ul {
          margin: 0.2em 0 0 0;
          font-size: 90%;

          li {
            margin: 0.2em 0 0.2em 1em;
            padding: 0;
            font-weight: normal;
            display: inline-block;
          }
        }
      }
    }
  }

  .burger-button {
    position: absolute;
    width: 36px;
    height: 30px;
    left: 36px;
    top: 30px;
    cursor: pointer;

    @media (min-width: 1200px) {
      display: none;
    }

    .burger-bars {
      background-color: #444;
      position: absolute;
      height: 20%;
      left: 0;
      right: 0;
    }
  }

  .cross-button {
    text-align: center;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;

    height: 24px;
    width: 24px;

    @media (min-width: 1200px) {
      display: none;
    }

    .cross {
      background: #ddd;
      position: absolute;
      width: 5px;
      height: 24px;
    }
  }
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
