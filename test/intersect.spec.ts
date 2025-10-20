import intersect, { Path } from 'path-intersection';


describe('path-intersection', function() {

  describe('api', function() {

    const p1: Path = [ [ 'M', 0, 0 ], [ 'L', 100, 100 ] ];
    const p2: Path = 'M0,100L100,0';


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

  });

});