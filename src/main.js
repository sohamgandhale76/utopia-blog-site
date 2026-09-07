/**
 * Spatial Glass Experience — Interactive Navigation System
 * Handles smooth section jumps and active story track syncing without background animations.
 */

(function () {
  'use strict';

  const scrollContainer = document.getElementById('glass-content');
  const storyItems = document.querySelectorAll('.nav-story-item');
  const sections = document.querySelectorAll('.content-section');

  if (!scrollContainer || !storyItems.length) return;

  function setActiveItem(targetId) {
    storyItems.forEach((item) => {
      const isTarget = item.getAttribute('data-target') === targetId ||
                       item.getAttribute('href') === `#${targetId}`;
      if (isTarget) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Click to jump smoothly across sections
  storyItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target') || item.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        const headerOffset = 10;
        const targetPos = targetEl.offsetTop - scrollContainer.offsetTop - headerOffset;
        scrollContainer.scrollTo({
          top: Math.max(0, targetPos),
          behavior: 'smooth'
        });
        setActiveItem(targetId);
      }
    });
  });

  // Observe scrolling content to automatically highlight the current visible channel
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    }, {
      root: scrollContainer,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0.1
    });

    sections.forEach((sec) => observer.observe(sec));
  }

  // Social Action Button Toggles (Like & Repost)
  document.querySelectorAll('.thread-action-btn.like-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isLiked = btn.classList.toggle('liked');
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.setAttribute('fill', isLiked ? '#f43f5e' : 'none');
      }
    });
  });

  document.querySelectorAll('.thread-action-btn.repost-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('reposted');
    });
  });

  // Graceful edge fade detection on scroll
  function updateScrollFade() {
    if (scrollContainer.scrollTop > 4) {
      scrollContainer.classList.add('is-scrolled');
    } else {
      scrollContainer.classList.remove('is-scrolled');
    }
  }
  scrollContainer.addEventListener('scroll', updateScrollFade, { passive: true });
  updateScrollFade();

})();


