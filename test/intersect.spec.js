'use strict';

var intersect = require('../');

var domify = require('domify');


describe('path-intersection', function() {

  describe('specs', function() {

    test('line with rounded rectangle (edge)', {
      p0: 'M80,140L100,140',
      p1: (
        'M100,100l80,0' +
        'a10,10,0,0,1,10,10l0,60' +
        'a10,10,0,0,1,-10,10l-80,0' +
        'a10,10,0,0,1,-10,-10l0,-60' +
        'a10,10,0,0,1,10,-10z'
      ),
      expectedIntersection: {
        x: 90,
        y: 140,
        segment1: 1,
        segment2: 7
      }
    });


    test('line with rounded rectangle corner (horizontal)', {
      p0: 'M80,105L100,105',
      p1: (
        'M100,100l80,0' +
        'a10,10,0,0,1,10,10l0,60' +
        'a10,10,0,0,1,-10,10l-80,0' +
        'a10,10,0,0,1,-10,-10l0,-60' +
        'a10,10,0,0,1,10,-10z'
      ),
      expectedIntersection: { x: 91, y: 105, segment1: 1, segment2: 8 }
    });


    test('line with rounded rectangle corner (vertical)', {
      p0: 'M70,50L100,120',
      p1: (
        'M100,100l80,0' +
        'a10,10,0,0,1,10,10l0,60' +
        'a10,10,0,0,1,-10,10l-80,0' +
        'a10,10,0,0,1,-10,-10l0,-60' +
        'a10,10,0,0,1,10,-10z'
      ),
      expectedIntersection: { x: 93, y: 103, segment1: 1, segment2: 8 }
    });


    test('line with rounded rectangle (cut corner)', {
      p0: 'M123,50L243,150',
      p1: (
        'M100,100l80,0' +
        'a10,10,0,0,1,10,10l0,60' +
        'a10,10,0,0,1,-10,10l-80,0' +
        'a10,10,0,0,1,-10,-10l0,-60' +
        'a10,10,0,0,1,10,-10z'
      ),
      expectedIntersection: { x: 184, y: 101, segment1: 1, segment2: 2 }
    });


    test('line with circle', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M100,100L150,150',
      expectedIntersection: { x: 137, y: 137, segment1: 5, segment2: 1 }
    });


    test('line with circle (top)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,100L150,150',
      expectedIntersection: { x: 150, y: 132, segment1: 2, segment2: 1 }
    });


    test('line with circle (bottom)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,150L150,200',
      expectedIntersection: { x: 150, y: 168, segment1: 4, segment2: 1 }
    });


    test('line with circle (left)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M100,150L150,150',
      expectedIntersection: { x: 132, y: 150, segment1: 4, segment2: 1 }
    });


    test('line with circle (right)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,150L200,150',
      expectedIntersection: { x: 168, y: 150, segment1: 2, segment2: 1 }
    });


    test('line with diamond', {
      p0: 'M413,172l25,25l-25,25l-25,-25z',
      p1: 'M413,197L413,274L555,274',
      expectedIntersection: { x: 413, y: 222, segment1: 2, segment2: 1 }
    });

  });


  describe('visual tests', function() {

    testScenario(
      'M293,228L441,227 M253,188l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z M441,227m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z'
    );


    testScenario(
      'M154,143L246,238 M129,118l50,0l0,50l-50,0z M231,195l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );


    testScenario(
      'M271,215L380,203L380,136L441,136 M240,179l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z M441,136m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z'
    );


    testScenario(
      'M402,354L402,159L274,118 M402,329l25,25l-25,25l-25,-25z M248,97l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );


    testScenario(
      'M154,143L338,248 M129,118l50,0l0,50l-50,0z M249,185l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );


    testScenario(
      'M221,62L221,104L298,104L249,252 M221,62m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z M254,204l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );


    testScenario(
      'M423,497L423,340L327,340L350,269 M423,472l25,25l-25,25l-25,-25z M276,202l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );


    testScenario(
      'M230,374L248,225 M211,349l36,0l0,50l-36,0z M252,162l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );

    testScenario(
      'M402,354L402,219L231,234 M402,329l25,25l-25,25l-25,-25z M223,173l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );

    testScenario(
      'M385,214L404,214L404,227L441,227 M295,207l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z M441,227m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z'
    );

    testScenario(
      'M423,497L423,180L300,262 M423,472l25,25l-25,25l-25,-25z M297,233l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z'
    );

    testScenario([
      'M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80',
      'M10 80 Q 95 10 180 80'
    ]);

    testScenario([
      'M10 80 Q 52.5 10, 95 80 T 180 80',
      'M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45',
      'M 100 150 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10'
    ]);

    testScenario([
      'M30 80 A 45 45, 0, 0, 0, 75 125 L 75 80 Z',
      'M30 80 A 45 45, 0, 1, 0, 75 125 L 75 80 Z',
      'M80 30 A 45 45, 0, 0, 1, 125 75 L 125 30 Z',
      'M30 30 A 45 45, 0, 1, 1, 75 75 L 75 30 Z'
    ]);

  });

});



// helpers //////////////////////////////////

function expectIntersection(intersection, expected) {

  var filteredIntersection = {
    x: Math.round(intersection.x),
    y: Math.round(intersection.y),
    segment1: intersection.segment1,
    segment2: intersection.segment2
  };

  expect(filteredIntersection).to.eql(expected);
}

function debug(label, pathArray, intersectionsArray, fail) {

  var paths = pathArray.map(function(path) {
    return '<path d="' + path + '" fill="none" stroke="#000" stroke-width="1" />';
  }).join('');

  var points = intersectionsArray.map(function(i) {
    if (!i) {
      return '';
    }

    return i.map(function(p) {
      return '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="none" stroke="red" stroke-width="1" />';
    }).join('');
  });

  var borderStyle = 'border: solid 3px ' + (fail ? 'red' : 'green');

  var svg = '<svg width="350" height="200" style="' + borderStyle + '; margin: 10px;">' +
    '<text x="10" y="20" font-size="15">' +
      label +
    '</text>' +
    '<g>' +
      paths +
      points +
    '</g>' +
  '</svg>';

  var svgNode = domify(svg);

  // show debug SVG
  document.body.appendChild(svgNode);

  // center visible elements group
  var group = svgNode.querySelector('g');

  var bbox = group.getBBox();

  group.setAttribute(
    'transform',
    'translate(' + (-bbox.x + 20) + ', ' + (-bbox.y + 50) + ')'
  );
}


var counter;

function testScenario(paths) {

  if (typeof paths === 'string') {
    paths = paths.split(/ /g);
  }

  counter = (counter || 0) + 1;

  var label = 'scenario #' + counter;

  it(label, function() {

    var intersections = [];

    for (var i = 0; i < paths.length; i++) {
      intersections.push(intersect(paths[i], paths[(i + 1) % paths.length]));
    }

    debug(label, paths, intersections);
  });

}

function test(label, options) {

  it(label, function() {
    var p0 = options.p0,
        p1 = options.p1,
        expectedIntersection = options.expectedIntersection;

    // guard
    expect(p0).to.exist;
    expect(p1).to.exist;
    expect(expectedIntersection).to.exist;

    // when
    var intersection = intersect(p0, p1);

    var err;

    // then
    try {
      expect(intersection.length > 0).to.be.true;

      expectIntersection(intersection[0], expectedIntersection);
    } catch (e) {
      err = e;
    }

    debug(label, [ p0, p1 ], [ intersection ], err);

    if (err) {
      throw err;
    }
  });

}
