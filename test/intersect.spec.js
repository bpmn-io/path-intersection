'use strict';

var intersect = require('../');

var domify = require('domify');


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

    test('two lines, shared origin', {
      p0: 'M0,0 h8 v-5 h-5 v3',
      p1: 'M0,0 v-7 h6',
      expectedIntersections: [
        { x: -0, y: -0, segment1: 1, segment2: 1 }
      ]
    });

    it('two long complex lines, shared origin', function() {
      var p0 = 'M1,1 h1000 v940 h-143 v182 h-877 v709 h-253 v-248 h-301 v-434 h841 v-715 h701 v-92 h284 v-115 h223 v-702 h969 v-184 h-992 v-47 h-183 v-474 h-437 v769 h-71 v-96 h14 v-503 h144 v-432 h948 v-96 h-118 v696 h684 v-539 h-47 v851 h-943 v-606 h-109 v884 h157 v-946 h75 v-702 h-414 v-347 h98 v517 h-963 v177 h467 v142 h-845 v-427 h357 v528 h-836 v222 h-328 v-504 h237 v-99 h-192 v147 h-544 v466 h765 v-845 h-267 v217 h-138 v-182 h226 v-466 h785 v-989 h55 v822 h-101 v-292 h78 v-962 h918 v-218 h-619 v324 h-467 v-885 h-658 v-890 h-764 v747 h369 v930 h-264 v916 h-696 v-698 h143 v-537 h-922 v-131 h141 v97 h-76 v883 h75 v657 h859 v-503 h399 v-33 h-510 v318 h-455 v-128 h146 v645 h-147 v651 h-388 v338 h-998 v-321 h-982 v-150 h123 v-834 h913 v200 h-455 v479 h-38 v-860 h-471 v-945 h-946 v365 h-377 v-816 h988 v597 h181 v253 h744 v-472 h-345 v-495 h-187 v443 h924 v536 h847 v-430 h-145 v827 h-152 v831 h-886 v597 h699 v751 h638 v580 h-488 v566 h-717 v220 h-965 v587 h-638 v880 h-475 v165 h-899 v-388 h326 v568 h940 v-550 h788 v76 h-189 v641 h629 v383 h-272 v840 h-441 v709 h-424 v-158 h-831 v576 h96 v401 h425 v-525 h-378 v907 h-645 v-609 h-336 v232 h-259 v280 h-523 v-938 h190 v9 h-284 v-941 h-254 v657 h572 v-443 h-850 v-508 h-742 v661 h-977 v-910 h-190 v-626 h140 v-762 h-673 v-741 h317 v518 h111 v-28 h598 v403 h465 v684 h79 v-725 h-556 v-302 h-367 v-306 h632 v550 h89 v292 h561 v84 h-923 v109 h-865 v880 h-387 v24 h99 v-934 h-41 v-29 h-225 v12 h-818 v-696 h652 v-327 h-69 v773 h-618 v-803 h-433 v467 h840 v281 h161 v400 h266 v67 h-205 v94 h551 v-332 h938 v759 h-437 v515 h-480 v-774 h-373 v-478 h963 v863 h-735 v-138 h-580 v-72 h-770 v-968 h-594';
      var p1 = 'M1,1 h-990 v248 h-833 v-137 h-556 v-943 h599 v-481 h963 v-812 h-825 v-421 h998 v847 h377 v19 h588 v657 h197 v354 h-548 v-849 h30 v209 h-745 v-594 h-168 v-5 h-357 v135 h94 v686 h965 v-838 h192 v-428 h-861 v-354 h653 v-543 h-633 v508 h655 v-575 h709 v53 h-801 v709 h-92 v-289 h-466 v875 h75 v448 h576 v972 h-77 v-4 h-267 v727 h-3 v687 h743 v830 h-803 v537 h-180 v-644 h-204 v-407 h866 v-886 h560 v848 h507 v-470 h38 v652 h806 v283 h-836 v629 h347 v679 h609 v224 h-131 v616 h-687 v-181 h539 v829 h-598 v55 h-806 v-208 h886 v-794 h-268 v365 h-145 v-690 h50 v698 h-140 v512 h-551 v-845 h351 v-724 h405 v245 h-324 v-181 h-824 v-351 h223 v360 h-687 v640 h-653 v-158 h786 v962 h931 v151 h939 v34 h610 v-684 h-694 v283 h402 v253 h388 v195 h732 v-809 h246 v571 h-820 v-742 h-507 v-967 h-886 v693 h-273 v-558 h-914 v122 h146 v-788 h83 v-149 h241 v-616 h326 v-40 h-192 v845 h-577 v-803 h-668 v443 h705 v793 h443 v883 h-715 v-757 h767 v360 h-289 v756 h696 v236 h-525 v-872 h-332 v-203 h-152 v234 h559 v-191 h340 v-926 h-746 v128 h867 v562 h-100 v-445 h-489 v814 h921 v286 h-378 v956 h-36 v998 h158 v611 h-493 v-542 h932 v-957 h55 v608 h790 v388 h414 v-670 h845 v394 h-572 v612 h842 v-792 h959 v-7 h-285 v-769 h-410 v940 h-319 v182 h42 v774 h758 v457 h10 v-82 h-861 v901 h-310 v217 h644 v-305 h92 v-339 h252 v-460 h609 v486 h553 v798 h809 v-552 h-183 v238 h138 v147 h-343 v597 h-670 v-237 h-878 v-872 h789 v-268 h-97 v313 h22 v-343 h907 v646 h-36 v516 h-808 v-622 h-927 v982 h-810 v149 h390 v-101 h-565 v-488 h-588 v-426 h-386 v-305 h503 v-227 h969 v-201 h-698 v850 h800 v961 h387 v-632 h543 v541 h750 v174 h543 v237 h487 v932 h220';

      var intersections = intersect(p0, p1);
      function isOrigin(point) {
        return (parseInt(point.x) === 0 && parseInt(point.y) === 0);
      }
      var origins = intersections.filter(isOrigin);
      expect(origins.legnth).equals(1);
      expect(origin.x).equals(-0);
      expect(origin.y).equals(-0);
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

  var paths = pathArray.map(function(path) {
    return '<path d="' + path + '" fill="none" stroke="#000" stroke-width="1" />';
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
  createTest(it, label, options);
}

// eslint-disable-next-line no-unused-vars
function testOnly(label, options) {
  createTest(it.only, label, options);
}

// eslint-disable-next-line no-unused-vars
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
