import intersect, { parsePath, Path } from 'path-intersection';

import domify from 'domify';


describe('path-intersection', function() {

  describe('api', function() {

    var p1 = [ [ 'M', 0, 0 ], [ 'L', 100, 100 ] ] satisfies Path;
    var p2 = 'M0,100L100,0';


    it('should support SVG path and component args', function() {

      // when
      const intersections = intersect(p1, p2);

      // then
      expect(intersections).to.have.length(1);

      // and then
      const [ intersection ] = intersections;

      expect(intersection).to.have.keys([
        'segment1',
        'segment2',
        'x',
        'y',
        'bez1',
        'bez2',
        't1',
        't2'
      ]);
    });


    describe('utility exports', function() {

      it('should export parsePath utility', function() {

        // given
        var pathString = 'M0,0L100,100';

        // when
        var parsed = parsePath(pathString);

        // then
        expect(parsed).to.eql([
          ['M', 0, 0],
          ['C', 0, 0, 100, 100, 100, 100]
        ]);
      });

    });

  });

});