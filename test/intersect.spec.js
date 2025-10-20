import intersect, { parsePathCurve } from 'path-intersection';
import { expect } from 'chai';

import domify from 'domify';


describe('path-intersection', function() {

  describe('api', function() {

    var p1 = [ [ 'M', 0, 0 ], [ 'L', 100, 100 ] ];
    var p2 = 'M0,100L100,0';


    it('should support SVG path and component args', function() {

      // when
      var intersections = intersect(p1, p2);

      // then
      expect(intersections).to.have.length(1);
    });

    it('parsePathCurve', function() {

      // when
      const parsed1 = parsePathCurve(p1);
      const parsed2 = parsePathCurve(p2);

      // then
      expect(parsed1).to.deep.eq([['M', 0, 0], ['C', 0, 0, 100, 100, 100, 100]])
      expect(parsed1.parsed).to.eq(true)

      expect(parsed2).to.deep.eq([['M', 0, 100], ['C', 0, 100, 100, 0, 100, 0]])
      expect(parsed2.parsed).to.eq(true)

      expect(intersect(parsed1, parsed2)).to.deep.eq([
        {
          x: 50,
          y: 50,
          segment1: 1,
          segment2: 1,
          t1: 0.5,
          t2: 0.5,
          bez1: [0, 0, 0, 0, 100, 100, 100, 100],
          bez2: [0, 100, 0, 100, 100, 0, 100, 0]
        }
      ])

      expect(parsed1, 'intersect should not mutate paths').to.deep.eq([['M', 0, 0], ['C', 0, 0, 100, 100, 100, 100]])
      expect(parsed2, 'intersect should not mutate paths').to.deep.eq([['M', 0, 100], ['C', 0, 100, 100, 0, 100, 0]])

    });


    it('should expose intersection', function() {

      // when
      var intersection = intersect(p1, p2)[0];

      // then
      expect(intersection.x).to.eql(50);
      expect(intersection.y).to.eql(50);
      expect(intersection.segment1).to.eql(1);
      expect(intersection.segment2).to.eql(1);
      expect(intersection.t1).to.eql(0.5);
      expect(intersection.t2).to.eql(0.5);
      expect(intersection.bez1).to.exist;
      expect(intersection.bez2).to.exist;
    });

  });


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
      expectedIntersections: [
        {
          x: 90,
          y: 140,
          segment1: 1,
          segment2: 7
        }
      ]
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
      expectedIntersections: [
        { x: 91, y: 105, segment1: 1, segment2: 8 }
      ]
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
      expectedIntersections: [
        { x: 93, y: 103, segment1: 1, segment2: 8 }
      ]
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
      expectedIntersections: [
        { x: 184, y: 101, segment1: 1, segment2: 2 },
        { x: 187, y: 103, segment1: 1, segment2: 2 }
      ]
    });


    test('line with circle', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M100,100L150,150',
      expectedIntersections: [
        { x: 137, y: 137, segment1: 5, segment2: 1 }
      ]
    });


    test('line with circle (top)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,100L150,150',
      expectedIntersections: [
        { x: 150, y: 132, segment1: 2, segment2: 1 },
        { x: 150, y: 132, segment1: 5, segment2: 1 }
      ]
    });


    test('line with circle (bottom)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,150L150,200',
      expectedIntersections: [
        { x: 150, y: 168, segment1: 3, segment2: 1 },
        { x: 150, y: 168, segment1: 4, segment2: 1 }
      ]
    });


    test('line with circle (left)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M100,150L150,150',
      expectedIntersections: [
        { x: 132, y: 150, segment1: 4, segment2: 1 }
      ]
    });


    test('line with circle (right)', {
      p0: 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z',
      p1: 'M150,150L200,150',
      expectedIntersections: [
        { x: 168, y: 150, segment1: 2, segment2: 1 }
      ]
    });


    test('line with diamond', {
      p0: 'M413,172l25,25l-25,25l-25,-25z',
      p1: 'M413,197L413,274L555,274',
      expectedIntersections: [
        { x: 413, y: 222, segment1: 2, segment2: 1 },
        { x: 413, y: 222, segment1: 3, segment2: 1 }
      ]
    });


    test('cut-through line with diamond', {
      p0: 'M413,172l25,25l-25,25l-25,-25z',
      p1: 'M413,97L413,274',
      expectedIntersections: [
        { x: 413, y: 172, segment1: 1, segment2: 1 },
        { x: 413, y: 222, segment1: 2, segment2: 1 },
        { x: 413, y: 222, segment1: 3, segment2: 1 },
        { x: 413, y: 172, segment1: 4, segment2: 1 }
      ]
    });


    test('line end on line', {
      p0: 'M170,150l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z',
      p1: 'M140,190L160,190',
      expectedIntersections: [
        { x: 160, y: 190, segment1: 7, segment2: 1 }
      ]
    });


    test('two lines, close proximity', {
      p0: 'M10,10 h8 v-5 h-5 v3',
      p1: 'M15,14 v-7 h6',
      expectedIntersections: [
        { x: 15, y: 10, segment1: 1, segment2: 1 },
        { x: 18, y: 7, segment1: 2, segment2: 2 }
      ]
    });


    test('two short lines, shared origin', {
      p0: 'M0,0 h8 v-5 h-5 v3',
      p1: 'M0,0 v-7 h6',
      expectedIntersections: [
        { x: -0, y: -0, segment1: 1, segment2: 1 }
      ]
    });


    test('two segments on same line, starting at same position', {
      p0: 'M0,0 h50',
      p1: 'M0,0 h-50',
      expectedIntersections: []
    });


    test('two segments on same line, ending at same position', {
      p0: 'M50,0 h-25',
      p1: 'M0,0 h25',
      expectedIntersections: []
    });


    test('two segments on same line, overlapping', {
      p0: 'M0,0 h30',
      p1: 'M0,0 h50',
      expectedIntersections: []
    });


    test('two diagonal lines', {
      p0: 'M0,0 L100,100',
      p1: 'M100,0 L0,100',
      expectedIntersections: [
        { x: 50, y: 50, segment1: 1, segment2: 1 }
      ]
    });


    test('points with scientific notation', {
      p0: 'M1.12345e-15,1.12345e-15 L100,100',
      p1: 'M100,0 L0,100',
      expectedIntersections: [
        { x: 50, y: 50, segment1: 1, segment2: 1 }
      ]
    });


    test('two ellipses', {
      p0: 'M2.6146209161795992e-14,73 A427,427 -90,0,0 -7.843862748538798e-14,927 A427,427 -90,1,0 2.6146209161795992e-14,73',
      p1: 'M71.048,16.789855835444428 A439.5,439.5 0,0,1 928.6918008943089,15.63106872689174 A439.5,439.5 0,1,1 71.048,16.789855835444428',
      expectedIntersections: [
        { x: 425, y: 546, segment1: 3, segment2: 3 },
        { x: 62, y: 78, segment1: 4, segment2: 4 }
      ]
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
      'M384,214L404,214L404,227L441,227 M295,207l80,0a10,10,0,0,1,10,10l0,60a10,10,0,0,1,-10,10l-80,0a10,10,0,0,1,-10,-10l0,-60a10,10,0,0,1,10,-10z M441,227m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z'
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

function expectIntersection(intersections, expected) {

  var normalizedIntersections = intersections.map(function(i) {
    return {
      x: Math.round(i.x),
      y: Math.round(i.y),
      segment1: i.segment1,
      segment2: i.segment2
    };
  });

  expect(normalizedIntersections).to.eql(expected);
}

function debug(label, pathArray, intersectionsArray, fail) {

  var colors = [
    '#000',
    '#AAA',
    '#777',
    '#333'
  ];

  var paths = pathArray.map(function(path, idx) {
    return '<path d="' + path + '" fill="none" stroke="' + colors[idx] + '" stroke-width="1" />';
  }).join('');

  var points = intersectionsArray.map(function(i) {
    if (!i) {
      return '';
    }

    return i.map(function(p) {
      return (
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="none" stroke="red" stroke-width="1" />' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r=".5" fill="red" stroke="none" stroke-width="1" />'
      );
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

  var svgNode = /** @type {SVGElement} */ (domify(svg));

  // show debug SVG
  document.body.appendChild(svgNode);

  // center visible elements group
  var group = /** @type {SVGGElement} */ (svgNode.querySelector('g'));

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
  createTest(it, label, options);
}

function testOnly(label, options) {
  createTest(it.only, label, options);
}

function testSkip(label, options) {
  createTest(it.skip, label, options);
}

function createTest(it, label, options) {

  it(label, function() {
    var p0 = options.p0,
        p1 = options.p1,
        expectedIntersections = options.expectedIntersections;

    // guard
    expect(p0).to.exist;
    expect(p1).to.exist;
    expect(expectedIntersections).to.exist;

    // when
    var intersections = intersect(p0, p1);
    var intersectionsCount = intersect(p0, p1, true);

    var err;

    // then
    try {
      expectIntersection(intersections, expectedIntersections);

      expect(intersections).to.have.length(intersectionsCount);
    } catch (e) {
      err = e;
    }

    debug(label, [ p0, p1 ], [ intersections ], err);

    if (err) {
      throw err;
    }
  });

}
