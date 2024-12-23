import React, { useState } from 'react';
import MyForm from './components/MyForm';
import { schema } from './schemas/altSchema4';
// import { uiSchema } from './schemas/altUiSchema4';
// import { schema } from './schemas/schema';
import { errorSchema } from './schemas/errorSchema';
import MainTemplate from './templates/MainTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './scss/style.scss';
import * as customFields from './fields/fields';

function App() {
  const [formData, setFormData] = useState({});
  // const [formData, setFormData] = useState({});
  // const prefilledFormData = {"firstName" : "Johnew", "lastName" : "Doe", "password" : "hello1", "date": "2024-12-17T12:08:24Z", "dateRange" : { startDate : "2024/08/16", endDate: "2024/09/16"}, "file": "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAALAAAAX3JlbHMvLnJlbHOt0sFKAzEQBuB7n2KZe3e2VURks72I0JtIfYCQzO4Gm0xIplrf3lAKulBWwR4z+efnI6TdHP2+eqeUHQcFq7qBioJh68Kg4HX3tLyHTbdoX2ivpUTy6GKuyk7ICkaR+ICYzUhe55ojhXLTc/JayjENGLV50wPhumnuMP3sgG7SWW2tgrS1K6h2n5H+142eRFstGg0nWsZUtpM4yqVcp4FEgWXzXMb5lKhLM+Bl0PrvIO57Z+iRzcFTkEsuOgoFS3aepGOcE91cU2QOWdj/8kSnzBzp9pqkaeLb88HJoj2Pz5pFi5Of2X0BUEsHCOVy9kToAAAA0AIAAFBLAwQUAAgICABNV4ZZAAAAAAAAAAAAAAAAEQAAAGRvY1Byb3BzL2NvcmUueG1sjVLLTsMwELzzFZHvqZ2UtmC1qQSoJyoh2grEzTib1BA/ZLuvv8dJm1CgB267M+PZh3c83csq2oJ1QqsJSnoERaC4zoUqJ2i1nMU3KHKeqZxVWsEEHcChaXY15oZybeHJagPWC3BRMFKOcjNBa+8NxdjxNUjmekGhAlloK5kPqS2xYfyTlYBTQoZYgmc58wzXhrHpHNHJMuedpdnYqjHIOYYKJCjvcNJL8LfWg5Xu4oOGOVNK4Q8GLkpbslPvneiEu92ut+s30tB/gl/nj4tm1FioelUcUDY+NUK5BeYhj4IBPZZrmZf+/cNyhrKUpNdxksZkuCS3dEAoIW9j/Ot9bXiMtc2etRRVtFhbXRS1siNqUQ6OW2F8+M+sIX8AIa+YKjdh+RmoeLVoJB1Uf2vFnJ+HAygE5HeH4HEBa7uTJ+x/4yVDmo7oYHg2XmvQVLawFfUdZqOmaJfWXbvN+wdwfxypS0Lsha/gCLfhn9vMvgBQSwcI0U6/enABAADnAgAAUEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAAQAAAAZG9jUHJvcHMvYXBwLnhtbJ2Ry27CMBBF9/2KyGJLnFAICDlGfagr1CI1he6Q6wyJq8S2bIPg7zshasSiq3o1dx7n2mO2OrdNdALnldE5SeOERKClKZWucvJRvIwXJPJB6FI0RkNOLuDJit+xjTMWXFDgIyRon5M6BLuk1MsaWuFjLGusHIxrRUDpKmoOByXh2chjCzrQSZJkFM4BdAnl2A5A0hOXp/BfaGlkdz+/LS4WeZwV0NpGBOCv3WTD6JBghQmiKVQLfDrB/KDYg7WNkiLgYvhafTl4uzrReZzF83gyWit9PO8/F9k+m0Y3DXt8yTfIQLNk9HhUTTlG7i2sI2/7jfN0Fid4rg2/ObYRFXieMtoHbGdciTqZMdqH7KkWTsiAA3yW4vSNvqntVKjfrZDIyLrhPyvo5kTlhK3R4r7zHCSK4VP4D1BLBwhNQBJwOAEAACoCAABQSwMEFAAICAgATVeGWQAAAAAAAAAAAAAAABMAAABkb2NQcm9wcy9jdXN0b20ueG1snc6xCsIwFIXh3acI2dtUB5HStIs4O1T3kN62AXNvyE2LfXsjgu6Ohx8+TtM9/UOsENkRarkvKykALQ0OJy1v/aU4ScHJ4GAehKDlBiy7dtdcIwWIyQGLLCBrOacUaqXYzuANlzljLiNFb1KecVI0js7CmeziAZM6VNVR2YUT+SJ8Ofnx6jX9Sw5k3+/43m8he22jfmfbF1BLBwjh1gCAlwAAAPEAAABQSwMEFAAICAgATVeGWQAAAAAAAAAAAAAAABwAAAB3b3JkL19yZWxzL2RvY3VtZW50LnhtbC5yZWxzrZLLasMwEEX3+Qox+1p2+qAUy9mUQrbF/QBFHj+I9UCalObvOzQhcSCYLry8V5o7RzMqNz92FN8Y0+CdgiLLQaAzvhlcp+Cr/nh4hU21Kj9x1MRXUj+EJLjGJQU9UXiTMpkerU6ZD+j4pPXRamIZOxm02esO5TrPX2ScZkB1kym2jYK4bQoQ9THgf7J92w4G3705WHR0p4VMdBwxcaKOHZKCk844B+T99usl27uD3WHkQV4JLtYcxOOSEK13VOvdiFeIizUH8bToIpCIHz1dxdmZQ3heEoG4djKDP3kyizPDqpQ3v7z6BVBLBwgpCwRg6AAAABwDAABQSwMEFAAICAgATVeGWQAAAAAAAAAAAAAAABEAAAB3b3JkL2RvY3VtZW50LnhtbO1a23LbNhB971dg+NBJZ2xdXMdN1UgZJ649SmNVUymZ6SMILknEIIABQMnq9Lkf0E/sl3TBm2xF0yiWL3EtPYjiAnv2dgAuKb58dZkJMgNjuZL9oNvqBAQkUxGXST94Pz3dfxEQ66iMqFAS+sECbPBq8M3LeS9SLM9AOoII0vZUP8iN7FmWQkbtfsaZUVbFbp+prKfimDOoDkGlYfpB6pzutduVUktpkDgWK5NRh6cmaZcqJ5Wt9kGnc9Q2IKhDf23Kta3RZv9lf5aJet58E6tzZSJtFANrMRGZKO1mlMsGptvZIGCP02joTSxHhs6vmLzuyEk5uES0n0A2brTQjSp7BQridTsreJOUaliiJduhnRmV6xotY5tEm1FzkWufMY0VDbngblEEvnSqe7idV6s5uxneFf50n38ZwEEDkLHeMJHK0FDgSkJPiA+PIGIwwAUVqmjhj7r4GpviMHELAWTem1HRD0Y+dSJo+5GPrJYyXBhgSqkp1cypks7iBGoZ5/1gAokC8n4YoCg9lnZFxOyV8wLH/lGjH3ZqyRu7KstrgU+0AC9sVz60mxDMOr+uWdzMz9vxa95zg8kFF4KcU63BkD/J+c+/jcgUaIa/j38Zjn4l72hovYYr9cpodqW549Jsmup33LoxNTQxVKclqsyzciYXM1HP6zRjw6iWdSuDjcLtV+VgTfSl7N4K8HkXkNt+P+tZTRnuRdqABTODYPC7yg0Z0Qx65NoKeFhfB2PqQJDXKTUJnV3keN0gH/hHughTyr8eP0PTflgab+LuQ+wNTAllmoCKz+b5RVnqI49x1+4Hp8UnaHZYAdSsssWnlixUTpgyQGyx3VtwLTJNuSVcMpFHYAk1QO0eccBSiQ4mHGXoZqR8o2c9wLdUK/vTDGumzAVEhDo/AfUI+Is89+0vlxWuTVUuIlnquNoM8X2B15JK7g+npTe29YWXl23I0lklC5d+LKUyKbr8jk+mgNj1gx/qjO/49Nmd8p+//r7TLfKe18xbOqPkmV8we0QpjevCaoP1JKFSbo+kPAQjcRf+bsfcx1PVJ8Fc37/vSPl4CvYUSLk+xnPKUi6BeAXp99YdbR97Sf9ftB2cwAyE8s9FnFLCkmcfJuSNirAnOOOu+ErzcI8MJd6OCf4RJUphsbHRFjS8hdbgZozD1noDvm0JelMKbG920Lpb+BE4Ehu85/d3Obsa3kmS15s9eX0+uYWLwFec8d3TkIfe09czr3lE4gu2v+1zEjLnNsVLRtnZoCZxKZA4d7mBmzwd2TVGD0mwTxbz0+iVtg97cDzcEfdRV/CpEneqCFxq4S8Dmf/CHTxbvVmlSK8IQDeSh+S6r5F3at4LIUaPK7rT2IHBjuCoAtlgSTAsHly6nIpJiXkPC2Vr2LX/NVlgriroQjdplxjcmCYVMXQy8bbnmKODg8MiHyn+fv6i/oNWJ+fUNFnqHpZzDE/SK6dJ7oo8l/pAo+bEKb2cFiu1nBYq51RWDVamRnk2LV2NM4SPgPHmX3T/nsjYKFfHEVNhqyB8vU64wXC5kvW4MNOwHI4UOzPcF97nwcPGNBeuqD0yeswdw5i/PyrcYik1k3LBH3Z+PKqSXKeyXb+W0V6+8DT4F1BLBwji1iaqvAQAADUlAABQSwMEFAAICAgATVeGWQAAAAAAAAAAAAAAAA8AAAB3b3JkL3N0eWxlcy54bWzVndty2zgShu/3KVi62r3I6GBZtlPjTDlKss6M7XgiZ3MNkZCFMUloefBhn34BkJQoNUGzwV5X7c1MTKk/Avj7B9EUD7/+9hyF3iNPUiHj88H4l9HA47EvAxHfnw9+3H15dzrw0ozFAQtlzM8HLzwd/Pbhb78+vU+zl5CnnoqP0/dP54N1lm3eD4epv+YRS3+RGx6rz1YyiVim/kzuh08yCTaJ9HmaKnwUDiej0WwYMREPKsx4CkCR8BOZylX2iy+joVythM8NSoWPR+ZfUVgBIr9LQyKWPOSbd4q3YZlYilBkL6YxAy/y33+9j2XClqHqrWrP4IPqayD9T3zF8jBL9Z/JbVL+Wf5l/vdFxlnqPb1nqS/E+WDOQrFMxEBtWV/E6f4WztLsIhVsb6Ofng8GFeBOtV61IBKqMZc6vvhGVtv8UQR7sMYQs2/4yVA3Of2P+sIjC88Hk0m1ZZ4ebgtZfF9t4/G7H4v9Dmw3LVVzzgcsebe40IHDcmSGh+O1OfzL7DjfbBKVGBd5Ji9fNmseb9uRJTkvgZsSWEcMgTwhy3icLYr8VJ/y1ZX0H3iwyNQH54PRoNj44+ttImSitD8fnJ2VGxc8EpciCHhc+2K8FgH/qdr0I+XBbvufX0xOlRt8mcfq30cnM5MyYRp8fvb5JlPGUp/GTAtwowNC/e1c7HZuwv9dwcblqDfFrznTzvTGh4gzNGLSiEhr3S92ctD3MXpHR2+1o+lb7ej4rXY0e6sdnbzVjk7fakdn/+sdiTjgz4URO1Bf40yIOEdEnCkR55iIMyPinBBxTok4XbPSzsmkDw8HRzRccIwg4oJDAhEXHAGIuGDCJ+KC+Z2IC6ZzIi6YvYm4YLIm4BZLLe+rslmc9aatpMximXEv48/9aSxWLGY2kfD0QY8nJJ0kwBQzW3kg7k3zmfkbZEjXI0vX43mmKz5PrryVuM9VJdK74Tx+5KEqPj0WBLqyoQMmPMuTmC6nE77iiar6OWVi00FDEXMvzqMlQW5u2D0Zi8cB8fBVRJJJYZvQLM/W2jWCIKkj5ieSYM5nZPPDlUj7j5WGeB/zMORErBuaFDOs/rWBwfQvDQymf2VgMP0Lg5pmVENU0ohGqqQRDVhJIxq3Ij+pxq2kEY1bSSMat5LWf9zuRBbyw2XIuPu5u3koU4oJbyHuY6YWAP0PN+U5U++WJew+YZu1p09hgy723s9HGbx4dxTHtC2Jal1vUmSuei3ivP+A7tGozLXlEdlryyMy2JbX32LXapmsF2iXNPXMIl9mjabtXhUsWJgXC9r+bmNZ/wzbGeCLSFIyGzRjCTL4Ri9nL4mWertW9m/YjtXfVoezEmnzSiRBK0PpP9BMw5cvG56osuyhN+mLDEP5xAM64iJLZJFrdctPJp0t/znarFkqUoDofqj/JP080qpds03vDt2GTMQ0un1+FzERenQriMu76yvvTm50makHhgb4UWaZjMiY5ZnAv//ky3/QNPBCFcHxC1FvL4hODxnYXBAcZAqSDIhIapkpYkFyDDW8P/jLUrIkoKHdJry4NCTjRMQFizYhlbfUvPik5h+C1ZDh/YslQp8XojLVHQmsdtowzZd/cb//VHcjPZIzQ9/yzJx/NEvd/qXQHq7/MmEP13+JYNRUhwedvwSd3cP17+wejqqz85ClqfDJelvxqLpb8aj727/4K3kylMkqD+kGsAKSjWAFJBtCGeZRnFL22PAIO2x41P0lTBnDIzglZ3j/TERAJoaBUSlhYFQyGBiVBgZGKkD/K3RqsP6X6dRg/a/VKWBES4AajCrPSA//RL/y1GBUeWZgVHlmYFR5ZmBUeXb0yeOrlVoE0x1iakiqnKsh6Q40ccajjUxY8kKE/Bzye0ZwgrSg3SZypW9ekHFxETfFcjZfZpSL7QJHJfJPviRrmmZRtovgjCgLQymJzq3tDjgmcv9ittfCzP0ZvZtwGzKfr2UY8MTSp9Z6ebFhvoCnTrv/WHIl7teZt1hvz/bXMbPRq5FVwb4X9voOm8Z8NmkJu+aByKOqofDq2dlR92Bwiexs+nrwbiWxF3ncMRLuc/Z65G6VvBd50jES7vO0YyS42HfW5odPLHloTISTtvzZ1niW5Dtp/WG+Cm7cbVsibSObUvCkLYv2rOJd+L7+tQCq080z9vhu5rHHY1xkp2DsZKd09pUd0Waw7/xRpI3nqF/5/Xt79QSY96edZ84/c5mBn6kn3W/q+qoWTnHKvUbOUfcfrvZmGfs4dp5u7IjO844d0XkCsiM6zUTWcNSUZKd0npvsiM6TlB2Bnq3gEQE3W8F43GwF411mK0hxma16rALsiM7LATsCbVSIQBu1x0rBjkAZFYQ7GRVS0EaFCLRRIQJtVLgAwxkVxuOMCuNdjAopLkaFFLRRIQJtVIhAGxUi0EaFCLRRHdf21nAno0IK2qgQgTYqRKCNCm5fRBoVxuOMCuNdjAopLkaFFLRRIQJtVIhAGxUi0EaFCLRRIQJlVBDuZFRIQRsVItBGhQi0UcH9wEijwnicUWG8i1EhxcWokII2KkSgjQoRaKNCBNqoEIE2KkSgjArCnYwKKWijQgTaqBCBNiq4wR5pVBiPMyqMdzEqpLgYFVLQRoUItFEhAm1UiEAbFSLQRoUIlFFBuJNRIQVtVIhAGxUi2vKz/InSdpn9GH/W03rFPuI+n6JR3+u3cu+dQ+2OqlplZ3W/F+GjlA9e442HR0fdIWIZCmlOUb8ADMEVEN/m9Tt8nB7j0bUr5b0Q5jdTcApz2jUSnFOZtqV8PRIUedO2TK9HglXntG32rUeCw+C0bdI1vqwuSlGHIxDcNs3UgseW8LbZuhYOh7htjq4FwhFum5lrgXCA2+bjWuCxpyfnw+jjjuM0215fCght6VgjnNgJbWkJtbKe2+8smp3QVT07oauMdgJKTysGL6wdhVbYjnKTGtoMK7W7Ue0ErNSQ4CQ1wLhLDVHOUkOUm9RwYsRKDQlYqd0nZzvBSWqAcZcaopylhig3qeGhDCs1JGClhgSs1D0PyFaMu9QQ5Sw1RLlJDRd3WKkhASs1JGClhgQnqQHGXWqIcpYaotykBlUyWmpIwEoNCVipIcFJaoBxlxqinKWGqDapzVkU92qpFo5bhNUCcQfkWiBucq4FOlRLtWjHaqlGcKyWoFZu1VJdNLdqqa6eW7VUl9GtWgJ6ulVLjcK6VUuNCrtVS3apcdVSk9TuRnWrlpqkxlVLVqlx1VKr1LhqqVVqXLVklxpXLTVJjauWmqR2n5zdqiWr1LhqqVVqXLXUKjWuWrJLjauWmqTGVUtNUuOqpSapex6Q3aqlVqlx1VKr1LhqyS41rlpqkhpXLTVJjauWmqTGVUtWqXHVUqvUuGqpVWpctWSXGlctNUmNq5aapMZVS01S46olq9S4aqlValy11Co1rlq6ViGC4BFQi4glmUf3vLhLlq4z1v/hhD/ihKcyfOSBR9vVK1Qvh097r7/SbPOiNvX9TI2ZfgJ67XYl89HXoP5iqqB4KKzG6WDdEq98EVf5JdPg8uda8+/yFV5PIpBP+h7uRIZmu34hWBVbJmxa3GOqturnFn3P9UvWWJ6ZR4rrLeeDybH50Xipn8rFy3djsVXGE9Wi6uqdv/wKG/JVVna7bMX/79vYfO2vqmNmUMzmB57Eh6P4Ru9tM+kBU8hfqxzyq2eSVSlUPk14eztc9SzhloSyPIDYtH43sVTfLq2y80HxvT0XgNysvYKurUvNrqguazhsd7W9yHKm9vstbjJJrB/gWW7XT/Q0N2Xb7PPA+eamFlC99q5umsoVk+meLyajTh64EkueFI9ZW7A4rXmh4ZNdotzITJrN3vz3P7zFvDLHbvsn/shids8S+F7B04b8PO2WZs2abMfxUJTdU6Zfk6V65eDrc9HJzDoXTZvG3LVT5s7jww6ZjU192U+l2jsRm7RvU8q1ufPynSyHLa62vyZAQ/ZX739URztePLI9teT+eILK/fZMFcV/5+lh3k4b8nbaZ8z0c3yfwYgVW8nG623TQCfo7u7npvSt3Rz9Wh/hfH80hb1PUhFsD4aj6XjkHzOLqVtXECLWGL160Bc8jqoDcKzfvJKzsHwUhovBi5fLVI+73q2vqocLtK6vvJ3n4XicneEPgPZ2ZnpVf9CgeovNqr8UqHkhWD78s3drs2VYjLD6x5yH4TUr/pIbxXoqBSwaHTyXamvlik/Ho9OGz5fFI4St8YmpNa2A4X5jhttG7saz+lf64b9QSwcI+i5z0mwMAABEeQAAUEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAASAAAAd29yZC9udW1iZXJpbmcueG1s1VjJbtswEL33KwwCPfRga7Eiq0bkoEBhwEVRFG3yATRNyUS5CCRtJ3/f0eZYsZsqsXTQieJw3gzfzEh40O3do+CjPdWGKRkjb+KiEZVEbZhMY/RwvxxHaGQslhvMlaQxeqIG3S0+3B7mcifWVIPfCEJIMz/EaGttNnccQ7ZUYDNRGZVwligtsIWtTp2D0ptMK0KNAaTgju+6oSMwk6gKo2K003JexRgLRrQyKrFjosRcJQkjtFpqhG6TuIR8VWQnqLRlWk05tsDbbFlm6mj71/LvBa/9BGmTVmD9Z5fl2AxSrRln9qlIXoc5eMFZnGPOCeCqmxeVA6TnFk/5PQSZr1KpNF5zaAwEQgtoC14bqzGxP3Zi1NitNtDfwoXvORwxWGLkFhbosLZg22OeOzmLsr9LcTRuKGEC8/IIkPf08Xj20ft0tH8jtZXTxJbm7KfOFwuXqdbaB3IgeM6UyW8Czs6zG5MbOMqjxGjmu7nfFsu0GMxpWHtXsXW1LJW0JudtCGMx+k1TRUcPqwL8RZoXJmJO9mW8IpBTUHlZKq9lqbg6UP2dWkv15XL5k57L5QVBm3q9Ttd/C91fSmB5me30ElvN0m1ndH0vbNL1orfTnXbxIgR9d9aPous7G3Q1yDd90wV219O96WiQw94HOZj61w9y2MUgz/ru7I3bwSdq1tUgR73TnYXX0406GuTPvQ9yGETvGWSnIVj+q2b8d6sZCVq2tJtdkjxb7RZue7FoPc9Hs1qNWl0nRobPtK0OGT7TthJk+EzbKpDhM20rPobPtK3uGD7TtrJj+EzbKo4hMj0XG7IQGfL0V0lDcTRK4BSeZzD/3zD/FOac/EBb/AVQSwcIwIRnmn4CAACGEwAAUEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAASAAAAd29yZC9mb250VGFibGUueG1stVHLTsMwELzzFZbv1GkPCEVNKwRCQkI90PYDNu6mWcmPyGsa8ve4aSMhyKGCcrN3Zmd2Z+fLD2vEAQOTd4WcTjIp0Gm/I7cv5HbzfHsvBUdwOzDeYSE7ZLlc3MzbvPIuskjtjvO2kHWMTa4U6xot8MQ36BJW+WAhpm/Yq9aHXRO8Ruakbo2aZdmdskBOnmXCJTK+qkjjk9fvFl08iQQ0ENMGXFPDcnGeTrS5A5uG3pBFFitsxZu34HqCriEwHjkHMIXMMqn6PrBkuqEaenoPNBR1PdQPEAhKg0dIncx+mK47W3oz6jW7ttdDooxbja7FLTH/0uqVSgx92GKNgareFUxcJXTQ+Z63Gptseu0QHsFQGWg0hqubfY0BHI+lcDrK5bv/5Spr3HsU25d/Wv784MUnUEsHCKP3t+QyAQAAMAQAAFBLAwQUAAgICABNV4ZZAAAAAAAAAAAAAAAAEQAAAHdvcmQvc2V0dGluZ3MueG1stVPBbtswDL3vKwzdGzsZsA1BnaI7BN2wbAen6Jmx6IaYJAoSXc/9+jFOgwYbsMOK3CTxkY+PfLq++eVd8YQpE4fazGeVKTC0bCk81uZ+u776ZIosECw4DlibEbO5Wb27HpYZRRSVC60Q8nKozV4kLssyt3v0kGccMWis4+RB9Joey4GTjYlbzFlTvSsXVfWh9EDBrLTkM7MvhmXE1GIQbaeqTHkIWOygd7KFXSMcFfIErjYfFy9h6IXvxrjHAKI6TnFJPR4BLfsI8npqjr0rMIBXVcdX2pEjGTds0WioT/SXJk9t4sydzDSl5K6jFidV5kQ6X5xT/knEOupEFlWJw0ZGh2sO0tAz3gb7tc9CWnES8YYO/tWAjkiZf+hqtmPENYL0SVd6GTLL31nWjuKGUuL0JVhd68XIqOswKQGB4EbdQomHac53CFYdfiHePuODghfV/P02QfvzM4uwP7Pj//NO9i7P7SuaOlnmG0wtTDAMV/fNIQkhy20mqM3htiOrpC8lTr919RtQSwcIayM6jogBAADyAwAAUEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAAVAAAAd29yZC90aGVtZS90aGVtZTEueG1sxVdfb5swEH/fp7D8vhrCvyRq0od20R46Tdq6D+AYA15tg2y3Xb79jCEBAukiLdlAIvb5d3c/3/kOcnv3S3DwSpVmpVxB/8aDgEpSpkzmK/jjafNxDoE2WKaYl5Ku4I5qeLf+cIuXpqCCAqsu9RKvYGFMtURIEyvG+qasqLRrWakENnaqcpQq/GbNCo5mnhcjgZmErb46R7/MMkboQ0leBJWmMaIox8ZS1wWrNAQSC8vxqwOCp5ogXO+pfuK01tO1gHD1nTj+fQ2HTZ/9+kerfHvPFXjFfAU9d0G0vkUHADdjXOauFtcC0ufZCBeGURjjg71ZY2+MowmNaXyw5wCYELuLse8wTGYkbLE9UDOcsJ0maeAP8D37wQiPo/oe4IMOH07EgnQx64GaYTTCR9vFNh3ajzp8PMInHk7DZIB3oIIz+TzOYBQHZL/bAyQr+edJ+CIKs2TWwjsU6p2cRl+aU+dI4J+l2liAS649pBKYXUUzTCzuHnO2VQw8srwwEFRYltqKvZm38QL7rO/QjUK7ygwpNlgwvrMQCEiBlabGVmtNEC8p7lluREQfidARIcHkH9kd8YquxaujgvohdQEW/Qnj/LvZcfqoHW1dcpZurNBNHOyQwKqwQ+gsHlaaWV8pV7gb69ZsrkFV6npH79i1QXsRX8q0kfr+vj/YXsOkaaRx0hXAkESu+44ip3y+My+acJYE5znzvUt4m/vveUO9aNrCAbh+l0Rh4xlogjlN6/i2Rjn9RokB3B0i457KPbctCB1l6lJZs8d4vLVFeKWsdUdEFzilx+IL522xmHKXzP9b3tC4gLkczsCbLZogqlsJruwbxPYlOxSVdaplDgHmuf1GIabZbaW0ecC6aHbm6rphJpihCnAm7Dnth5fLzo0/S7x/4mfhXXU/6DiKNMtsUk5Iuqlda4xMrl4ejKaYbfPNxVv6ORYG5R6dqoiLvSl6zoKpolzMD9Lp9vT3nahHYT5JwTtB4YJvlZ67+F2z125Dx8cODb4z0Ojvwl6y/g1QSwcIRsDEy/8CAAAtDQAAUEsDBBQACAgIAE1XhlkAAAAAAAAAAAAAAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbL2Vy26DMBBF9/kK5G0FTrqoqgqSRR/LNot0XTlmIG7xQ7ZJk7/vGBCqojQkTdoNEszce+54BKSzjayiNVgntMrIJBmTCBTXuVBlRl4XT/EtmU1H6WJrwEXYq1xGVt6bO0odX4FkLtEGFFYKbSXzeGtLahj/YCXQ6/H4hnKtPCgf++BBpukDFKyufPS4wcctF+Ukum/7AiojzJhKcOaxTEOV7tVZqNwB4VrlO+niLlmCyqbHrYRxVz8TjCp3AEKGycLz/Yp3A/slTQE1L3jcVuQQzZn1z0xiA30Lk9DkwvPsI+Waz602DtdiITl88Ad4QR0bNALrBRxHROvTgbooBAf0qCVKEggHnUN+KpvXzmt5Nr61ORL+qW3ebbY3wPb/2HKD/g49a+rghiNzcA6/CzhBX5FMqMEczm8rcJdP0foO4lUtl2BRcvkEvfVgiAKpC7asfvHKDYXorYcXAd6j5i9W0TkPRvD4z4D2Ojk7RmPTIUcpbX5S0y9QSwcI65qXKXgBAADTBgAAUEsBAhQAFAAICAgATVeGWeVy9kToAAAA0AIAAAsAAAAAAAAAAAAAAAAAAAAAAF9yZWxzLy5yZWxzUEsBAhQAFAAICAgATVeGWdFOv3pwAQAA5wIAABEAAAAAAAAAAAAAAAAAIQEAAGRvY1Byb3BzL2NvcmUueG1sUEsBAhQAFAAICAgATVeGWU1AEnA4AQAAKgIAABAAAAAAAAAAAAAAAAAA0AIAAGRvY1Byb3BzL2FwcC54bWxQSwECFAAUAAgICABNV4ZZ4dYAgJcAAADxAAAAEwAAAAAAAAAAAAAAAABGBAAAZG9jUHJvcHMvY3VzdG9tLnhtbFBLAQIUABQACAgIAE1XhlkpCwRg6AAAABwDAAAcAAAAAAAAAAAAAAAAAB4FAAB3b3JkL19yZWxzL2RvY3VtZW50LnhtbC5yZWxzUEsBAhQAFAAICAgATVeGWeLWJqq8BAAANSUAABEAAAAAAAAAAAAAAAAAUAYAAHdvcmQvZG9jdW1lbnQueG1sUEsBAhQAFAAICAgATVeGWfouc9JsDAAARHkAAA8AAAAAAAAAAAAAAAAASwsAAHdvcmQvc3R5bGVzLnhtbFBLAQIUABQACAgIAE1XhlnAhGeafgIAAIYTAAASAAAAAAAAAAAAAAAAAPQXAAB3b3JkL251bWJlcmluZy54bWxQSwECFAAUAAgICABNV4ZZo/e35DIBAAAwBAAAEgAAAAAAAAAAAAAAAACyGgAAd29yZC9mb250VGFibGUueG1sUEsBAhQAFAAICAgATVeGWWsjOo6IAQAA8gMAABEAAAAAAAAAAAAAAAAAJBwAAHdvcmQvc2V0dGluZ3MueG1sUEsBAhQAFAAICAgATVeGWUbAxMv/AgAALQ0AABUAAAAAAAAAAAAAAAAA6x0AAHdvcmQvdGhlbWUvdGhlbWUxLnhtbFBLAQIUABQACAgIAE1XhlnrmpcpeAEAANMGAAATAAAAAAAAAAAAAAAAAC0hAABbQ29udGVudF9UeXBlc10ueG1sUEsFBgAAAAAMAAwAAAMAAOYiAAAAAA=="};

  const prefilledFormData = {"firstName" : "Johnew", "lastName" : "Doe", "password" : "hello1", "date": "2024-12-17T12:08:24Z", "dateRange" : { "startDate" : "2024/08/16", "endDate": "2024/09/16"},"file" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAq1BMVEX///995/8AAAAtvOgcHBwWFhYYGBjx8fHS09U/P0DZ2tvP0NJvb26UlJaA7v8bGBchNTg4Zm6goKBEREV41+gbBQBhrbcSBgGC6/93d3fm5ubFxcZlZWcXDQhe1fQQKzFRze4trNFs3vcmj60iEAUQUGJHxuolJSUTDw8yMjK7u7uLi4uxsbELHCMaJygmf5tbw91KutlcnqZNn7E6lKsJOUknXmuBgYNbW1wkv2SRAAADWklEQVR4nO2afXeaMBSHVQRfWtgmW4danbMvCLit29rq9/9kA6GOQULzuyRsO+c+fylJ8PGShNyc9HoMwzAMwzAMwzAMwzAMw/y/jDoBc1pGgw6IlojTdBBNQtuBsMH6jp1qTQGp2W4ycYYQThiCLYap1AyRsmEpOwxt41L+G5DdDmyAS/nhl085bwk0Nnwp/IpL3X77nPMe5yFr99BU+D398IMgdWOd2AYw66zdRlK4PRV6QeBdkaW2fZTCSVJ4croP0o90KXNOdCmDTmQpslMgLi07UaUITlvVOFGlYKXmOOWFZyeS1IcrD3YC4tSVVHOcqk7B+qYDKSxO/bXVgVTzuFtX47SxOpCC49SBFNifNlYHUgrz+KYSJ8v6aVYKmp+KC1ZgdkpQf9+dyJ22ZucpcNwVToYnT1KczM7oKuPOq9Q+vepNSkHj7sWJuvJUk8L6eNnJoBSpP9FXnipStDgVX01JUebx83LWjFSL/mRMCnvf5e/g8rLfhBQWJ68aJyNS4LpgU3MyINVq3BmSoqzprP6f1XVL1R8PHCftUgprulKhV8Spil4pLEeQxEmzlMrat7RWkcRJrxQhlxJv32iUAnMEaZx0SmnqT1qlSONOss2lS4qUc8q23jRJkXJOiZI2qRZrX1NS6J5Y47PTJaU3TlqkyDmnSSmd406TVMscwYyU7v6kQaoxTn183GmRIvWnV+LUUqp1LmVAipZLvarUSkpDLiXjkSrVPueUQt5HNzPucieqlI6cU+pElMJyTg+LE1UKWvvW93pecaJJkXIE1WdHk7p9zBquPU90DMMrzmGcC/Oo3veFtSttCyeK1PDpLuWdhOdqYfb97llWvd425Ylwfmq3SvkoYVUtXNWuyMnrrnaolDPx0XNjOCpSizOjJIuUrYKjfLFOKuWOfv+qyMmd+GeiYRgq/lvREcCBaqycqPSbrkBqHvd6o/EUY+HPljVm/gK8zTiO42QukDpkUhcgYze6rhG5Y/Q+8T4+HGRS4D9MiWc1Yvgm42W8TIRSxySZX8LMBeB3yeIrkpoeB9f7eO/+BZLk4A+O4tOxF5fHw3KxGHdL2p/co399IVTKWOwP2eicdEgURsdkL5ykSnRz6Jt+AJxhGIZhGIZhGIZhGIZhmH+EX6/i/e24e+XTAAAAAElFTkSuQmCC"};

  // const renderFormData = () => {
  //   console.log("data submitted : ", formData);

  //   return Object.keys(formData).map((key) => {
  //     const value = formData[key];

  //     if (key === 'file') {
  //       console.log(value);
  //       return (
  //         <div className='d-flex flex-column'>
  //           <strong> File Details : </strong>
  //           <strong>File Name: </strong>
  //           <p>{value['name']}</p>
  //           <strong>File size: </strong>
  //           <p>{value['size']}</p>
  //           <strong>File Type: </strong>
  //           <p>{value['type']}</p>
  //         </div>
  //       )
  //     }

  //     if (key === 'alt-date') {
  //       return (<div>
  //         <p><strong>From (alt-date) </strong></p>
  //         <strong>Day</strong><p>{value['day']}</p>
  //         <strong>Month</strong><p>{value['month']}</p>
  //         <strong>Year</strong><p>{value['year']}</p>
  //       </div>)
  //     }

  //     if (key === 'date' && value) {
  //       return (
  //         <p key={key}>
  //           <strong>{schema.properties[key]?.title}:</strong> {new Date(value).toLocaleDateString()}
  //         </p>
  //       );
  //     }

  //     if (key === 'dateRange' && value) {
  //       const { startDate, endDate } = value;
  //       const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : '';
  //       const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : '';

  //       return (
  //         <p>
  //           <strong>From :</strong> {formattedStartDate}
  //           <strong> To : </strong>{formattedEndDate}
  //         </p>
  //       );
  //     }

  //     const field = schema.properties[key];
  //     console.log("Field : ", field);
  //     return (
  //       field ? (
  //         <p key={key}>
  //           <strong>{field.title}:</strong> {value}
  //         </p>
  //       ) : null
  //     );
  //   });
  // };

  const templates = {
    myCustomRowTemplate: MainTemplate
  }

  // const fields = {
  //   myPasswordWidget : customFields.MyPasswordWidget,
  //   customFileWidget : customFields.CustomFileWidget
  // }

  const fields = {
    BodyField: customFields.JoditEditorField,
    AutoComplete: customFields.AutoCompleteField,
    ProfileImage: customFields.FileUploadWithPreview,
    link: customFields.DownloadWidget,
    CustomFile: customFields.FileUpload,
    newpoll: customFields.PollComponent,
    CustomPassword: customFields.PasswordWidget,
    CustomGenPassword: customFields.PasswordGenWidget,
    DatePickerWidget: customFields.DatePickerWidget,
    CustomPhoneNumber: customFields.PhoneNumberWidget,
    //   myPasswordWidget : customFields.MyPasswordWidget,
  //   customFileWidget : customFields.CustomFileWidget
  }
  const handleFormSubmit = (data) => {
    setFormData(data);
    console.log("data : ", data);
  };

  const handleOnError = () => {
    console.log("Error occured");
  }

  const handleOnSuccess = () => {
    window.alert("Form Submitted");
  }

  const handleOnChange = (fieldName) => {
    console.log("Change occurred in : ", fieldName);
  } 

  return (
      <div className="d-flex flex-column justify-content-center align-items-center align-middle">
        <MyForm schema={schema}
          // uiSchema={uiSchema}
          templates={templates}
          fields={fields}
          onSubmit={handleFormSubmit}
          onChange={handleOnChange}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          formData={prefilledFormData}
          errorSchema={errorSchema} />
     {/* {Object.keys(formData).length > 0 && renderFormData()} */}
      </div>
  );
}

export default App;
