<template lang="pug">
  div.entry(:class='{lineAfter: song.position(year, true) % 5 === 0}')
    div.n(v-if='year.previous()')
      tijdloze-position(:song='song' :year='year.previous()')
    div.r
      tijdloze-position-change(:song='song' :year='year')
      tijdloze-position(:song='song' :year='year')
    div.n(v-if='year.next()')
      tijdloze-position(:song='song' :year='year.next()')
    div.a
      tijdloze-song-artist(:song='song')
    div.s
      tijdloze-song(:song='song')
    div.releaseYear
      | {{song.album.releaseYear}}
</template>

<script>
  export default {
    name: 'FullList',
    props: {
      song: {
        type: Object
      },
      year: {
        type: Object
      }
    }
  }
</script>

<style lang="less">
  div.entry {
    display: flex;
    height: 24px;

    &.header {
      font-weight: bold;
      overflow: auto;
      border-bottom: solid black 1px;
      scrollbar-gutter: stable;
    }

    &.lineAfter {
      border-bottom: 1px #888888 dotted;
    }

    div {
      padding: 1px 7px;
    }
    .n {
      width: 30px;
      flex-grow: 1;
      text-align: center;
      color: #555555;
      font-size: 80%;
    }

    .r {
      width: 60px;
      flex-grow: 1;
      text-align: center;
      font-weight: bold;
    }
    .a {
      text-align: right;
      width: 125px;
      flex-grow: 8;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .s {
      width: 150px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      flex-grow: 8;
    }

    .releaseYear {
      width: 50px;
      flex-grow: 1;
      color: #555555;
      font-size: 80%;

      @media (max-width: 660px) {
        display: none;
      }
    }
  }
</style>
