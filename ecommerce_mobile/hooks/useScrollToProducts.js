import { useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';

/** Scroll a parent ScrollView so the products anchor sits below the header/categories */
export default function useScrollToProducts() {
  const scrollRef = useRef(null);
  const scrollContentRef = useRef(null);
  const productsAnchorRef = useRef(null);

  const scrollToProductsSection = useCallback(() => {
    const anchor = productsAnchorRef.current;
    const content = scrollContentRef.current;
    const scroll = scrollRef.current;
    if (!anchor || !content || !scroll) return;

    const doScroll = (y) => {
      if (typeof y !== 'number' || y < 0) return;
      scroll.scrollTo({ y: Math.max(0, y - 16), animated: true });
    };

    InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        anchor.measureLayout(
          content,
          (_x, y) => doScroll(y),
          () => {
            anchor.measureInWindow((_ax, anchorY) => {
              content.measureInWindow((_cx, contentY) => {
                doScroll(anchorY - contentY);
              });
            });
          }
        );
      });
    });
  }, []);

  const scheduleScrollToProducts = useCallback(() => {
    scrollToProductsSection();
    setTimeout(scrollToProductsSection, 120);
    setTimeout(scrollToProductsSection, 320);
    setTimeout(scrollToProductsSection, 520);
  }, [scrollToProductsSection]);

  return {
    scrollRef,
    scrollContentRef,
    productsAnchorRef,
    scheduleScrollToProducts,
  };
}
