.. _sphinxdemo:

=====================
Sphinx extension demo
=====================

This page illustrates some of the features provided by the Sphinx
extension for writing documentation in the Sage's official
documentation style:

- Cross-references to Sage's official documentation:

    - :ref:`thematic-tutorials`
    - :ref:`sage.combinat.tutorial`
    - :meth:`sage.functions.other.binomial`

- Cross-references to Python's official documentation:

    - :ref:`reference`
    - :mod:`os`
    - :func:`slice`

- Code blocks:

    Assuming internet access, the page can be activated, making the
    following code blocks into live cells that can be modified and
    evaluated::

        sage: 1 + 1
        2
        sage: y = 1

        sage: z = 2
        sage: y + z
        3

    Plots::

        sage: plot(sin(x))

    3D plots (non functional yet)::

        sage: x,y = SR.var('x,y')
        sage: plot3d(x^2 + y^2, (x,-2,2), (y,-2,2))

    LaTeX output (non functional yet)::

        sage: %display latex
        sage: factor(x^100 - 1)
        (x - 1)*(x + 1)*(x^2 + 1)*(x^4 - x^3 + x^2 - x + 1)*(x^4 + x^3 + x^2 + x + 1)*(x^8 - x^6 + x^4 - x^2 + 1)*(x^20 - x^15 + x^10 - x^5 + 1)*(x^20 + x^15 + x^10 + x^5 + 1)*(x^40 - x^30 + x^20 - x^10 + 1)

    Plain code blocks (i.e. not containing a sage prompt) are not affected::

        > sage --notebook jupyter

- TODO's:

    .. TODO::

        Fix the failing cross-references above!

- Miscellaneous roles:

    - :wikipedia:`SageMath`
    - :trac:`12214`
    - :oeis:`A000108`
    - :pari:`factor`
    - :arxiv:`1412.4765`
    - :doi:`10.1088/1742-6596/600/1/012002`
