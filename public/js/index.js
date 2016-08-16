var counter = 0
var counterMax = 6
var pickedMaps = []
var team1 = 'Team 1'
var team2 = 'Team 2'
var statusTypes = ['Ban', 'Ban', 'Pick', 'Pick']

var mapContainer = $('#maps')
var maps = [
  { name: 'Hideout', image: 'http://i.imgur.com/RwEDe4g.png' },
  { name: 'Battlegrounds', image: 'http://i.imgur.com/RKse50K.png' },
  { name: 'Cove', image: 'http://i.imgur.com/hZJpmzJ.png' },
  { name: 'Hillside', image: 'http://i.imgur.com/lkZTlsz.png' },
  { name: 'Outpost', image: 'http://i.imgur.com/9g4ulbt.png' },
  { name: 'Stoneshill', image: 'http://i.imgur.com/eVTjMom.png' },
  { name: 'Darkforest', image: 'http://i.imgur.com/NBZyfBa.png' }
]

for (var i = 0; i < maps.length; ++i) {
  var map = maps[i]
  mapContainer.append(mapTemplate(map.name, map.image))
}

info()

$('.input-teams').click(function() {
  $('.ui.modal').modal('show')
})

$('.ok.button').click(function() {
  team1 = $('input[name="team1"]').val()
  team2 = $('input[name="team2"]').val()
})

$('.map-panel').click(function() {
  var elem = $(this)
  if (counter < counterMax && !elem.attr('picked')) {
    var title = elem.find('.team-name')
    var mapElem = elem.find('.map-name')
    var mapName = mapElem.text()
    var statusElem = elem.find('.status')
    var status = statusTypes[counter % 4]

    if (counter % 2 === 0) {
      elem.addClass('team-1')
      title.html(team1)
    } else {
      elem.addClass('team-2')
      title.html(team2)
    }

    if (status === 'Pick') {
      pickedMaps.push(mapName)
      statusElem.html(status).css({ color: '#73f461' })
    } else if (status !== 'Pick') {
      statusElem.html(status).css({ color: '#f49c61' })
    }

    elem.attr('picked', true)
    elem.css({ borderWidth: 5 })
    elem.removeClass('default')
    statusElem.html(status)
    counter++
    info()
  }
})

function mapTemplate(name, url) {
  return (
    '<div style="background: url(' + url + ')" class="map-panel default">' +
      '<div class="team-name"></div>' +
      '<div class="map-name">' + name + '</div>' +
      '<div class="status"></div>' +
    '</div>'
  )
}

function info() {
  if (counter === counterMax) {
    $('.next-turn').html('Played map will be: ' + pickedMaps[Math.round(Math.random() * 3)])
  } else if (counter % 2 === 0) {
    $('.next-turn').html(team1 + '\'s turn to ' + statusTypes[counter % 4])
  } else {
    $('.next-turn').html(team2 + '\'s turn to ' + statusTypes[counter % 4])
  }
}
