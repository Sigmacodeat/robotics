# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Zum Inhalt springen" [ref=e2] [cursor=pointer]:
    - /url: "#content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "SIGMACODE AI Robotics – Home" [ref=e5] [cursor=pointer]:
        - /url: /en
        - img [ref=e6] [cursor=pointer]
        - generic [ref=e9] [cursor=pointer]: SIGMACODE AI Robotics
      - navigation "Main navigation" [ref=e10]:
        - button "Print to PDF" [ref=e11]
        - button "Toggle theme" [ref=e12]:
          - img [ref=e13]
        - group "Language" [ref=e19]:
          - 'link "Language: DE" [ref=e20] [cursor=pointer]':
            - /url: /chapters/3
            - text: DE
          - 'link "Language: EN" [ref=e22] [cursor=pointer]':
            - /url: /en/chapters/3
            - text: EN
  - main [ref=e23]:
    - generic [ref=e26]:
      - heading "404" [level=1] [ref=e27]
      - heading "This page could not be found." [level=2] [ref=e29]
```