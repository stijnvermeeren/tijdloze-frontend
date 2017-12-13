<template>
    <div>
        <h2>Alle Tijdloze lijsten</h2>

        <div class="notabs">
            <table v-for="year in [...years].reverse()" class="lijst topvijflijst">
                <tbody>
                    <tr>
                        <th colspan="3" class="r">
                            <tijdloze-year :year="year"></tijdloze-year>
                        </th>
                    </tr>
                    <tr v-for="{song, artist} in topFive[year]">
                        <td class="r">
                            {{song.positions[year]}}
                        </td>
                        <td>
                            <tijdloze-artist :coreArtist="artist"></tijdloze-artist>
                        </td>
                        <td>
                            <tijdloze-song :coreSong="song"></tijdloze-song>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
      computed: {
        years() {
          return this.$store.state.years;
        },
        topFive() {
          const result = {};

          for (const year of this.years) {
            result[year] = [];
            for (let position = 1; position <= 5; position++) {
              const song = this.$store.getters.findSongAtPosition(year, position);
              if (song) {
                const artist = this.$store.state.artists[song.artistId];
                result[year].push({song, artist});
              }
            }
          }

          return result;
        }
      },
      head: {
        title: 'Lijsten'
      }
    }
</script>

<style lang="less">
    table.lijst {
        margin-bottom: 20px;
        width: 90%;

        tr:first-child th,
        tr:first-child td {
            border-bottom: 1px solid black;
        }
        tr:last-child th,
        tr:last-child td {
            border-bottom: none !important;
        }
        td,
        th {
            text-align: center;
            padding: 0.16em 0.5em;
        }
        th {
            font-weight: bold;
        }
        td.l,
        th.l,
        th.headerl {
            text-align: left;
        }
        td.a,
        th.a {
            text-align: right;
        }
        td.a + td,
        th.a + th {
            text-align: left;
        }
        td.r,
        th.r {
            white-space: nowrap;
            font-weight: bold;
            width: 2.5em;
        }
        td.r:not(:first-child),
        th.r:not(:first-child) {
            border-left: 1px solid black;
        }
        td.r:not(:last-child),
        th.r:not(:last-child) {
            border-right: 1px solid black;
        }
        td.y,
        th.y {
            width: 3em;
        }
        td.y:not(:first-child),
        th.y:not(:first-child) {
            border-left: 1px solid black;
        }
        td.y:not(:last-child),
        th.y:not(:last-child) {
            border-right: 1px solid black;
        }
        td.n,
        th.n {
            color: #555555;
        }
        td.i {
            font-style: italic;
            white-space: nowrap;
        }
        td.s {
            font-size: 85%;
        }
        td.s ul {
            margin: 0;
            padding: 0;
        }
        td.s ul li {
            list-style-type: none;
            list-style-position: outside;
        }
        td.s ul li {
            padding: 0 0 0 10px;
            display: inline;
        }
        td.s ul li a {
            display: inline;
        }
        td.wrap {
            white-space: normal;
        }
        &.perEen tr td,
        &.perVijf tr:nth-child(5n+1) td,
        tr.lineAfter td {
            border-bottom: 1px #888888 dotted;
        }
        &.home tr:first-child th {
            background-color: #fabf8b;
            font-size: 120%;
            padding: 0.3em 0;
            border-bottom: none;
        }
        &.home tr:nth-child(2) td {
            padding-top: 1em;
        }
        &.topvijflijst th.r {
            text-align: left;
            padding-left: 45px;
        }

        tr.inCurrentList td:nth-child(2),
        tr.inCurrentList td:last-child {
            font-weight: bold;
        }

        table.valueData {
            margin: 0.3em 0;

            td:first-child,
            th:first-child {
                width: 3em;
                font-weight: bold;
            }
            td {
                border: none !important;
            }
        }

        table.valueDataData {
            margin: 0.3em 0;

            td:first-child,
            th:first-child {
                width: 3em;
            }
            td:nth-child(2),
            th:nth-child(2) {
                width: 17em;
            }
            td {
                border: none !important;
            }
        }
        table.valueValueDataData {
            margin: 0.3em 0;

            td:first-child,
            th:first-child {
                width: 6em;
            }
            td:nth-child(2),
            th:nth-child(2) {
                width: 4em;
            }
            td:nth-child(3),
            th:nth-child(3) {
                width: 40%;
            }
            td {
                border: none !important;
            }
        }
        table.valueDataDataValue {
            margin: 0.3em 0;

            td:first-child,
            th:first-child {
                width: 4em;
            }
            td:nth-child(2),
            th:nth-child(2) {
                width: 35%;
            }
            td:nth-child(4),
            th:nth-child(4) {
                width: 4em;
            }
            td {
                border: none !important;
            }
        }
    }

</style>
